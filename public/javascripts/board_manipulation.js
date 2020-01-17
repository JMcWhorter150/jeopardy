// ============ GLOBAL VARIABLES ============

let QUESTIONANSWERED = false;
let BUZZED = false;
let ROUND = 1;
let CANBUZZ = false;

// TODOS 
// TODO: Export Data after game ends // my part done
// TODO: Figure out how to manipulate string text when image or <a> should be shown
// TODO: Fix answers that are not text and instead are just strings --- DONE
// TODO: Make categories expand for mobiles
// TODO: (BUG)Make final jeopardy not run if score is less than 0
// TODO: (BUG)Find game breaking bug that happens after second daily double, sometimes
// TODO: Add more attributes to send back to game
// TODO: Add timer functionality to answer    (NOW) (touchstart event is tapping the screen on mobile)
// TODO: (BUG)If dd answered, timers don't show up (BUG)

// When question answered, if right, add to correct questions
// When question not answered, add to jeopardy questions not answered
// check round and add to right place when necessary
// if user not logged in variable = null;
// ============ SET INITIAL BOARD CONDITIONS FUNCTIONS ============

function setInitialScore() {
  let userScore = document.querySelector('.score');
  userScore.dataAttribute = {
    Score: 0,
    jeopardyQuestionsCorrect: 0,
    jeopardyQuestionsNotAnswered: 0,
    dJeopardyQuestionsCorrect: 0,
    dJeopardyQuestionsNotAnswered: 0,
    fJeopardyCorrect: 0
  };
}

function setInitialAnswerAttribute() {
  const answer = document.querySelector('#answerField');
  answer.dataAttribute = {
    Question: null,
    Value: null,
    Answer: null
  }
}

function addAnswerCheck() {
  let answer = document.querySelector('#answerField');
  // change triggers when value for input field changed and focus lost or submitted
  answer.addEventListener('change', populateAnswerDOM);
  answer.addEventListener('change', checkIfRight);
  answer.addEventListener('change', showAnswerDOM);
}

function addBetCheck() {
let bet = document.querySelector('#betField');
bet.addEventListener('change', checkBet);
}

function addBuzzer() {
  document.addEventListener('keyup', contestantBuzzed);
}



// ============ RESET BOARD FUNCTIONS ============

function resetQuestionsDOM(factor) {
  for (let i=1;i<7;i++) {
      let questionArr = document.querySelectorAll(`.question${i}`);
      questionArr.forEach(element => {
          element.textContent = `$${i * factor * 200}`; // sets values for each question box to be regular jeopardy or double jeopardy
          element.dataAttribute = {
            Answer: null,
            Question: null,
            Value: null
          }; // add any other onclick functionality functions here
          element.removeEventListener("click", populateQuestionDOM);
          element.removeEventListener('click', dailyDouble);
          element.removeEventListener('click', removeQuestionDOM);
          // element.removeEventListener('click', answerTimer);
          element.removeEventListener('click', waitForBuzz);
      });
  }
}

function populateBoardDOM(obj=arrayObject, roundNumber=ROUND) {
  // takes show object, updates text content of each block, adds onclick to each block
  // five questions, six categories
  showRound(roundNumber); // shows page while stuff happens behind jeopardyHeader container
  resetQuestionsDOM(roundNumber); // resets the question values (200 for reg jeopardy, 400 for double jeopardy) and resets onclick buttons
  populateCategoriesDOM(obj); // updates the category names to be the first six categories from the arrayObj
  populateQuestionsDOM(obj, roundNumber); // updates all the questions to have data attribute with question, answer, and value and onclick buttons
}

function populateCategoriesDOM(obj) {
  // grabs first six categories from object and makes category names
  const categoryDOMArray = document.querySelectorAll('.category-item');
  for (let i=0;i<6;i++) {
      categoryDOMArray[i].textContent = obj[i].Category;
  }
}

function populateQuestionsDOM(obj, roundNumber) {
  // grabs each category of questions, and adds data to each element of category
  const questionsDOMArray = document.querySelectorAll('.question-item');
  for (let i=0;i<obj.length;i++) {
    let questionValue = obj[i].Value;
    questionValue = questionValue.replace(/[$,]+/g,""); // gets rid of all $ and , using regex (was breaking score)
    questionsDOMArray[i].dataAttribute = {
          "Question": obj[i].Question,
          "Answer": obj[i].Answer,
          "Value": "$" + questionValue
      }; // NEVER CHANGE THE ORDER OF THE BELOW.....EVER
      if ("$" + questionValue !== questionsDOMArray[i].textContent) { // if the value of the question doesn't match what the value should be, makes it a daily double
        questionsDOMArray[i].addEventListener('click', dailyDouble); // daily double question events
        questionsDOMArray[i].addEventListener('click', populateQuestionDOM);
        questionsDOMArray[i].addEventListener('click', removeQuestionDOM);
      } else { 
        questionsDOMArray[i].addEventListener('click', populateQuestionDOM); // regular question events
        // questionsDOMArray[i].addEventListener('click', answerTimer);
        questionsDOMArray[i].addEventListener('click', waitForBuzz);
        questionsDOMArray[i].addEventListener('click', removeQuestionDOM);
      }
  }
}

function showRound(roundNumber) {
  // shows round (jeopardy, double jeopardy, final jeopardy) for 3 secs
  let jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = "flex";
  let headerText = arrayObject[roundNumber - 1][0].Round;
  let round = document.querySelector('.round');
  round.textContent = headerText;
  let timeleft = 3;
  let headerTimer = setInterval(function(){
    timeleft -= 1;
    if(timeleft <= 0) {
      console.log('clearing header')
      clearInterval(headerTimer);
      jeopardyHeader.style.display = "none";
      round.textContent = "";
      }
    }, 1000);
}

// ============ UPDATE DOM DURING GAME FUNCTIONS ============

function updateScoreDOM(score) {
  // updates score after each question. also updates the color of the score container
  let userScore = document.querySelector('.score');
  let currentScore = userScore.dataAttribute.Score;
  if (score + currentScore < 0) { // if score less than zero, makes container red
    const resultContainer = document.querySelector('.resultContainer');
    resultContainer.style.backgroundColor = "red";
  } else { // if positive, makes container blue
    const resultContainer = document.querySelector('.resultContainer');
    resultContainer.style.backgroundColor = "#0314a2";
  } // updates score text and score data attribute
  userScore.textContent = `Score: $${currentScore + score}`;
  userScore.dataAttribute.Score = currentScore + score;
  // updates question data if right
  if (score > 0) {
    if (ROUND === 1) {
      userScore.dataAttribute.jeopardyQuestionsCorrect += 1;
    } else if (ROUND === 2) {
      userScore.dataAttribute.dJeopardyQuestionsCorrect += 1;
    } else if (ROUND === 3) {
      userScore.dataAttribute.dJeopardyQuestionsCorrect += 1;
    }
  }
}

function removeQuestionDOM(event) {
  // removes text and resets dataattribute and onclicks after question selected
  event.target.textContent = "";
  event.target.removeEventListener("click", removeQuestionDOM);
  event.target.removeEventListener('click', populateQuestionDOM);
  event.target.removeEventListener('click', dailyDouble);
  // event.target.removeEventListener('click', answerTimer);
  event.target.removeEventListener('click', waitForBuzz);
  event.target.dataAttribute = {
    "Answer": null,
    "Value": null,
    "Question": null
  };
}
    
function checkBoard() {
  // checks after each question to see if round is over
  let questions = document.querySelectorAll('.question-item');
  let done = false;
  for (let question of questions) {
    if (question.textContent.length > 0) {
      return; // exits out of function if any questions have text remaining
    }
  }
  // only runs after all questions gone
  if (ROUND === 1) {
    // update board to double jeopardy
    ROUND = 2;
    populateBoardDOM(arrayObject[1], 2); // only runs if all questions have no text
    return ROUND;
  } else if (ROUND === 2) {
    // starts final jeopardy
    ROUND = 3;
    finalJeopardy();
    return ROUND;
  } else if (ROUND === 3) {
    // sets final game screen after final jeopardy
    populateFinalScore();
  }
}
 
function populateQuestionDOM(event) {
    // when question is clicked, updates result box with question, updates resultbox question value
    let questionContainer = document.querySelector('.questionContainer');
    let question = document.querySelector('#questionText');
    let answer = document.querySelector('#answerField');
    answer.dataAttribute = {
        "Answer": event.target.dataAttribute.Answer,
        "Value": event.target.dataAttribute.Value,
        "Question": event.target.dataAttribute.Question
    };
    question.textContent = event.target.dataAttribute.Question;
    // changes display from none to flex to show question
    questionContainer.style.display = "flex";
    // puts cursor in answerField
    questionContainer.focus();
    // answer.focus();
    // answer.select();
}

function populateAnswerDOM(event) {
  // should fill answer page with answer data after answer is submitted and show it
  const answerField = document.querySelector('#answerField');
  const correctAnswerText = document.querySelector('#correctAnswerText');
  const yourAnswerText = document.querySelector('#yourAnswerText');
  correctAnswerText.textContent = `Correct Answer: ${answerField.dataAttribute.Answer}`;
  yourAnswerText.textContent = `Your Answer: ${event.target.value}`;
}

function populateAnswerDOMGeneral() {
  const answerField = document.querySelector('#answerField');
  const correctAnswerText = document.querySelector('#correctAnswerText');
  correctAnswerText.textContent = `Correct Answer: ${answerField.dataAttribute.Answer}`;
}

function resetAnswerDOM() {
  // cleans out the answer dom for next page
  const answerContainer = document.querySelector('.answerContainer');
  const correctAnswerText = document.querySelector('#correctAnswerText');
  const yourAnswerText = document.querySelector('#yourAnswerText');
  correctAnswerText.textContent = "";
  yourAnswerText.textContent = "";
  answerContainer.style.display = 'none';
}

function showAnswerDOM(event) {
  const answerContainer = document.querySelector('.answerContainer');
  answerContainer.style.display = 'flex';
  setTimeout(resetAnswerDOM, 3000); // resets page after 3 seconds
}

function resetQuestionContainer() {
    // empties the question box, hides question box, and checks board state
    let questionContainer = document.querySelector('.questionContainer');
    let question = document.querySelector('#questionText');
    let answer = document.querySelector('#answerField');
    answer.dataAttribute = {
      Answer: null,
      Question: null,
      Value: null
    };
    answer.value = "";
    answer.style.display = "none";
    question.textContent = "";
    questionContainer.style.display = "none";
    checkBoard();
}

function missedQuestion() {
    // used when person doesn't answer in time, then resets question and lowers score
    let answerValue = document.querySelector('#answerField').dataAttribute.Value;
    answerValue = parseInt(answerValue.slice(1));
    updateScoreDOM(answerValue * -1);
    resetQuestionContainer();
}

function checkIfRight(event) {
    // checks whether user input is correct
    let userAnswer = formatText(event.target.value);
    let correctAnswer = formatText(event.target.dataAttribute.Answer);
    let answerValue = event.target.dataAttribute.Value;
    answerValue = parseInt(answerValue.slice(1)); // reformatting answer value from '$1000' to 1000
    if (userAnswer === correctAnswer) {
        console.log('right');
        updateScoreDOM(answerValue);
    } else {
        console.log('wrong');
        updateScoreDOM(answerValue * -1);
    }
    resetQuestionContainer();
    QUESTIONANSWERED = true;
    return QUESTIONANSWERED; // returned to update global variable to turn off timer function
}

function formatText(str) {
    // changes users answer question answer
    if (Number.isInteger(parseInt(str))) { // if answer is number
      return str;
    } else if (typeof str === 'string') { // if answer is string
      return str.toLowerCase();
    } else { // if answer is anything else, just return the answer
      return str;
    }
}

function answerTimer() {
  // once buzzed in, times how long they have to type the answer of the question
  // when someone clicks a category, it waits and then auto exits if no answer
  console.log('timer started');
  let timeleft = 9; // should match whatever the progress bar max is in html
  let progressBar = document.querySelector('#answerBar');
  progressBar.style.display = "block";
  let questionTimer = setInterval(function(){
      progressBar.value = 10 - timeleft; // first number should be timeleft +1
      timeleft -= 1;
      if (QUESTIONANSWERED) {
        console.log('question answered before timer stopped')
        QUESTIONANSWERED = false;
        progressBar.style.display = "none";
        progressBar.value = 0;
        clearInterval(questionTimer);
        return QUESTIONANSWERED; // resets questionanswered global variable for next question
      } else if(timeleft <= 0) {
        progressBar.style.display = "none";
        progressBar.value = 0;
        console.log('timer stopped')
        clearInterval(questionTimer);
        missedQuestion();
      }
  }, 1000);
}

function waitForBuzz() {
  // after user selects question, question shows, if user presses a key, then show answer box, then start answer timer. If user doesn't tap, then goes to next answer.
  CANBUZZ = true;
  let timeleft = 50;
  let questionBar = document.querySelector('#questionBar');
  questionBar.style.display = "block";
  let buzzTimer = setInterval(() => {
    timeleft -= 1;
    if (timeleft % 10 === 0) {
      questionBar.value = 51 - timeleft;
    }
    if (BUZZED) {
      console.log('contestant buzzed');
      BUZZED = false;
      questionBar.style.display = "none";
      questionBar.value = 0;
      clearInterval(buzzTimer);
      CANBUZZ = false;
      return BUZZED;
    } else if (timeleft <= 0) {
      CANBUZZ = false;
      questionBar.style.display = "none";
      questionBar.value = 0;
      console.log('contestant no buzz');
      clearInterval(buzzTimer);
      populateAnswerDOMGeneral();
      showAnswerDOM();
      resetQuestionContainer();
      updateQuestionsNotAnswered();
    }
  }, 100)
}

function updateQuestionsNotAnswered() {
  const userScore = document.querySelector('.score');
  if (ROUND === 1) {
    userScore.dataAttribute.jeopardyQuestionsNotAnswered += 1;
  } else if (ROUND === 2) {
    userScore.dataAttribute.dJeopardyQuestionsNotAnswered += 1;
  }
}

function contestantBuzzed(event) {
  // when user buzzes, show answer field, start answer timer
  if (event.code === "Enter" && CANBUZZ) {
    const answer = document.querySelector('#answerField');
    answer.style.display = "inline-block";
    answer.focus();
    answer.select();
    answerTimer();
    BUZZED = true;
    return BUZZED;
  }
}

// ============ BETTING FUNCTIONS ============

function setBet() {
  // shows bet container, allows user to make a bet for the question
  const betContainer = document.querySelector('.betContainer');
  const betText = document.querySelector('#betText');
  const bet = document.querySelector('#betField');
  let score = document.querySelector('.score').dataAttribute.Score;
  if (score < 1000) { // jeopardy rules that if you are betting at less than 1000, you can bet up to 1000
    score = 1000;
  }
  betText.textContent = `Enter in a wager up to ${score}`;
  betContainer.style.display = "flex";
  // puts cursor in answerField
  bet.focus();
  bet.select();
}

function checkBet(event) {
  // makes sure bet is valid, then populates question
  const userBet = parseInt(event.target.value);
  const totalScore = document.querySelector('.score').dataAttribute.Score;
  const betField = document.querySelector('#betField');
  if (userBet < 5) { // jeopardy minimum bet is 5 except for final jeopardy
    betField.focus();
    betField.select();
    return;
  } else if (!Number.isInteger(userBet)) { // makes them enter a number
    betField.focus();
    betField.select();
    return;
  } else if (totalScore < 1000) { // checks to make sure if their score is less than 1000, that they can bet up to 1000 and no more
    if (userBet > 1000) {
      betField.focus();
      betField.select();
      return
    }
  } else if (userBet > totalScore) { // cant bet more than they have
    betField.focus();
    betField.select();
    return
  }
  const betContainer = document.querySelector('.betContainer');
  const answer = document.querySelector('#answerField');
  const bet = document.querySelector('#betText');
  answer.dataAttribute.Value = `$${userBet}`;
  bet.textContent = "";
  betContainer.style.display = 'none';
  if (ROUND === 3) { // different question population after bet for final jeopardy
    populateQuestionFinalJeopardy();
  } else { // regular daily double functionality
    populateDDQuestion();
  }
}

// ============ DAILY DOUBLE FUNCTIONS ============

function populateDDQuestion() {
  // puts question on screen after betting for daily double
  const questionContainer = document.querySelector('.questionContainer');
  const question = document.querySelector('#questionText');
  const answer = document.querySelector('#answerField');
  question.textContent = answer.dataAttribute.Question;
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  answer.style.display = 'inline-block';
  answer.focus();
  answer.select();
}



function dailyDouble(event) {
  // when daily double question clicked, does daily double functions
  showDailyDouble(); // shows daily double screen
  setTimeout(() => { // waits to show bet screen
    setBet();
  }, 3000) // should match showDailyDouble timeleft
}

function showDailyDouble() {
  // shows daily double screen (like round screen)
  let jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = "flex";
  let headerText = `Daily Double!`;
  let round = document.querySelector('.round');
  round.textContent = headerText;
  let timeleft = 3;
  let headerTimer = setInterval(function(){
    timeleft -= 1;
    if(timeleft <= 0) {
      console.log('clearing header')
      clearInterval(headerTimer);
      jeopardyHeader.style.display = "none";
      round.textContent = "";
      }
    }, 1000);
}

// ============ FINAL JEOPARDY FUNCTIONS ============

function finalJeopardy() {
  showRound(3); // shows final jeopardy screen
  setTimeout(() => {
    finalJeopardyCategory(); // shows category
    setTimeout(() => {
      setBet(); // lets them set their final jeopardy bet
    }, 3000)
  }, 3000);
}

function populateQuestionFinalJeopardy() {
  // when question is clicked, updates result box with question, updates resultbox question value, removes question
  let questionContainer = document.querySelector('.questionContainer');
  let question = document.querySelector('#questionText');
  let answer = document.querySelector('#answerField');
  answer.dataAttribute.Answer = arrayObject[2][0].Answer; // update 2 and 0 if data is not array of 3 arrayobjects with all the questions
  question.textContent = arrayObject[2][0].Question; // see above
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  answer.style.display = 'inline-block';
  answer.focus();
  answer.select();
}

function finalJeopardyCategory() {
  // shows final category screen before bet
  let jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = "flex";
  let categoryText = arrayObject[2][0].Category; // update 2 and 0 if data is not array of 3 arrayobjects with all the questions
  let round = document.querySelector('.round');
  round.textContent = categoryText;
  let timeleft = 3;
  let categoryTimer = setInterval(function(){
    timeleft -= 1;
    if(timeleft <= 0) {
      console.log('clearing category')
      clearInterval(categoryTimer);
      jeopardyHeader.style.display = "none";
      round.textContent = "";
      }
    }, 1000);
}

// ============ SENDING DATA AFTER GAME FUNCTIONS ============

function populateFinalScore() {
  // shows final screen and allows score submission
  const jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = 'flex';
  const text = document.querySelector('.round');
  const score = document.querySelector('.score');
  let name = 'Joe'; // update to be username
  text.textContent = `Congratulations ${name}! Your final score was: ${score.dataAttribute.Score}`;
  const form = document.createElement('form');
  form.method = "POST";
  const userIdInput = document.createElement('input');
  userIdInput.name = "id";
  userIdInput.value = "1";
  userIdInput.style.display = "none";
  const scoreInput = document.createElement('input');
  scoreInput.name = "score";
  scoreInput.value = score.dataAttribute.Score;
  scoreInput.style.display = "none";
  const dateInput = document.createElement('input');
  dateInput.name = 'date';
  dateInput.value = new Date();
  dateInput.style.display = "none";
  const jeopardyQuestionsCorrect = document.createElement('input');
  jeopardyQuestionsCorrect.name = 'jeopardyQuestionsCorrect';
  jeopardyQuestionsCorrect.value = score.dataAttribute.jeopardyQuestionsCorrect;
  jeopardyQuestionsCorrect.style.display = "none";
  const jeopardyQuestionsNotAnswered = document.createElement('input');
  jeopardyQuestionsNotAnswered.name = 'jeopardyQuestionsNotAnswered';
  jeopardyQuestionsNotAnswered.value = score.dataAttribute.jeopardyQuestionsNotAnswered;
  jeopardyQuestionsNotAnswered.style.display = "none";
  const dJeopardyQuestionsCorrect = document.createElement('input');
  dJeopardyQuestionsCorrect.name = 'dJeopardyQuestionsCorrect';
  dJeopardyQuestionsCorrect.value = score.dataAttribute.dJeopardyQuestionsCorrect;
  dJeopardyQuestionsCorrect.style.display = "none";
  const dJeopardyQuestionsNotAnswered = document.createElement('input');
  dJeopardyQuestionsNotAnswered.name = 'dJeopardyQuestionsNotAnswered';
  dJeopardyQuestionsNotAnswered.value = score.dataAttribute.dJeopardyQuestionsNotAnswered;
  dJeopardyQuestionsNotAnswered.style.display = "none";
  const fJeopardyCorrect = document.createElement('input');
  fJeopardyCorrect.name = 'fJeopardyCorrect';
  fJeopardyCorrect.value = score.dataAttribute.fJeopardyCorrect;
  fJeopardyCorrect.style.display = "none";
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Post Score';
  form.appendChild(userIdInput);
  form.appendChild(scoreInput);
  form.appendChild(dateInput);
  form.appendChild(jeopardyQuestionsCorrect);
  form.appendChild(jeopardyQuestionsNotAnswered);
  form.appendChild(dJeopardyQuestionsCorrect);
  form.appendChild(dJeopardyQuestionsNotAnswered);
  form.appendChild(fJeopardyCorrect);
  form.appendChild(submit);
  jeopardyHeader.appendChild(form);
}

// questions correct jeopardy jeopardyQuestionsCorrect ("1")
// questions not answered jeopardy jeopardyQuestionsNotAnswered ("1")
// questions correct double jeopardy qdjea dJeopardyQuestionsCorrect
// questions not answered double jeopardy dJeopardyQuestionsNotAnswered
// questions correct final jeopardy fJeopardyCorrect

// ============ FUNCTIONS RUN AT BEGINNING OF GAME ============

populateBoardDOM(arrayObject[0], ROUND); // sets up first jeopardy, then checkboard runs the rest of the game
setInitialScore();
setInitialAnswerAttribute();
addAnswerCheck(); // never removed
addBetCheck(); // never removed
addBuzzer(); // never removed
// 