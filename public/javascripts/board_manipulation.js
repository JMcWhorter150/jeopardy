// ============ GLOBAL VARIABLES ============

let QUESTIONANSWERED = false;
let BUZZED = false;
let ROUND = 1;
let CANBUZZ = false;
let BASEAMOUNT = 100;

// TODOS 
// TODO: Figure out how to manipulate string text when image or <a> should be shown


// ============ SET INITIAL BOARD CONDITIONS FUNCTIONS ============

function setInitialScore() {
  let userScore = document.querySelector('.score');
  userScore.dataAttribute = {
    Score: 0,
    jeopardyQuestionsCorrect: 0,
    jeopardyQuestionsNotAnswered: 0,
    jeopardyQuestionsIncorrect: 0,
    dJeopardyQuestionsCorrect: 0,
    dJeopardyQuestionsIncorrect: 0,
    dJeopardyQuestionsNotAnswered: 0,
    fJeopardyCorrect: 0,
    fJeopardyIncorrect: 0
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
  document.addEventListener('touchend', contestantBuzzedMobile);
}



// ============ RESET BOARD FUNCTIONS ============

function getBaseAmount(obj=arrayObject) { // updates the base amount to be 100, 200 etc. for old games. Breaks if first question is a daily double
  let initialValue = parseInt(obj[0][0]["Value"].slice(1)); // gets "$100" and converts it to int
  let checkInitialValue = parseInt(obj[0][1]["Value"].slice(1)); // checks the second question value and converts it to int
  initialValue = (initialValue < checkInitialValue) ? initialValue : checkInitialValue; // makes initial value the lower of the two (guessing that daily doubles would be a higher amount wagered)
  BASEAMOUNT = initialValue;
}

function resetQuestionsDOM(factor) {
  for (let i=1;i<7;i++) {
      let questionArr = document.querySelectorAll(`.question${i}`);
      questionArr.forEach(element => {
          element.textContent = `$${i * factor * BASEAMOUNT}`; // sets values for each question box to be regular jeopardy or double jeopardy
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

function resetQuestionsFinal() {
  let categoriesArr = document.querySelectorAll('.category-item');
  categoriesArr.forEach(element => {
    element.textContent = "";
  });
  for (let i=1;i<7;i++) {
    let questionArr = document.querySelectorAll(`.question${i}`);
    questionArr.forEach(element => {
        element.textContent = ""; // sets values for each question box to be regular jeopardy or double jeopardy
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
    startDoubleJeopardy();
  } else if (ROUND === 2) {
    startFinalJeopardy();
  } else if (ROUND === 3) {
    // sets final game screen after final jeopardy
    setTimeout(populateFinalScore, 3000);
  }
}

function startDoubleJeopardy() {
  ROUND = 2;
  setTimeout(() => { // only runs if all questions have no text, and waits for answer card to finish
    populateBoardDOM(arrayObject[1], 2)
  }, 3000);
}

function startFinalJeopardy() {
  resetQuestionsFinal();
  ROUND = 3;
  let score = document.querySelector('.score').dataAttribute.Score;
  if (score < 0) { // final jeopardy doesn't run if score less than 0
    setTimeout(populateFinalScore, 3000);
  } else {
    setTimeout(finalJeopardy,3000);
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
  let hrefs = getHrefs(event.target.dataAttribute.Question);
  if (hrefs) {
    hrefs.forEach(href => createImg(href));
    question.textContent = removeAnchors(event.target.dataAttribute.Question)
  } else {
    question.textContent = event.target.dataAttribute.Question;
  }
  // let href = getHref(event.target.dataAttribute.Question);
  // if (href) {
  //   populateImg(href);
  //   question.textContent = removeAnchors(event.target.dataAttribute.Question)
  // } else {
  //   question.textContent = event.target.dataAttribute.Question;
  // }
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  questionContainer.focus();
  // answer.focus();
  // answer.select();
}

function getHrefs(string) {
  let textArray = string.split("href=\"");
  if (textArray.length === 1) { // string doesn't have href, so return null
    return null;
  } else if (textArray.length > 1) { // string has one or more hrefs
    textArray = textArray.splice(1); // get rid of first bit of text (everything up until href)
    return textArray.map(item => cleanHrefs(item)); // for each href, cleans it up and returns it in an array
  }
}

function cleanHrefs(string) {
  let array = string.split("\" target");
  return array[0];
}

function removeAnchors(string) {
  let removeString = string.substring(string.indexOf(`<a href`), string.indexOf(`_blank">`) + 8);
  let finalAnchorPosition = string.indexOf('</a>');
  let finalAnchor = string.substring(finalAnchorPosition, finalAnchorPosition + 4);
  string = string.replace(removeString, "");
  string = string.replace(finalAnchor, "");
  if (string.indexOf(`<a href`) > -1) { // if there is another href in the string, runs again, otherwise returns the string
    return removeAnchors(string)
  } else {
    return string;
  }
}

function createImg(hrefStr) {
  const pictureFrame = document.createElement('div');
  pictureFrame.className = "pictureFrame";
  const img = document.createElement('img');
  img.className = 'qImg';
  img.src = hrefStr;
  pictureFrame.appendChild(img);
  let questionContainer = document.querySelector('.questionContainer');
  questionContainer.appendChild(pictureFrame);
}

function clearImg() {
  const pictureFrame = document.querySelector('.pictureFrame');
  pictureFrame.parentNode.removeChild(pictureFrame);
  if (document.querySelector('.pictureFrame')) {
    clearImg();
  } else {
    return;
  }
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
    clearImg();
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
        gotRightStats();
    } else {
        console.log('wrong');
        updateScoreDOM(answerValue * -1);
        gotWrongStats();
    }
    resetQuestionContainer();
    QUESTIONANSWERED = true;
    return QUESTIONANSWERED; // returned to update global variable to turn off timer function
}

function gotRightStats() {
  let userScore = document.querySelector('.score');
  if (ROUND === 1) {
    userScore.dataAttribute.jeopardyQuestionsCorrect += 1;
  } else if (ROUND === 2) {
    userScore.dataAttribute.dJeopardyQuestionsCorrect += 1;
  } else if (ROUND === 3) {
    userScore.dataAttribute.fJeopardyCorrect += 1;
  }
}

function gotWrongStats() {
  let userScore = document.querySelector('.score');
  if (ROUND === 1) {
    userScore.dataAttribute.jeopardyQuestionsIncorrect += 1;
  } else if (ROUND === 2) {
    userScore.dataAttribute.dJeopardyQuestionsIncorrect += 1;
  } else if (ROUND === 3) {
    userScore.dataAttribute.fJeopardyIncorrect += 1;
  }
}

function formatText(str) {
    // changes users answer question answer
    if (Number.isInteger(parseInt(str))) { // if answer is number
      return str;
    } else if (typeof str === 'string') { // if answer is string
      str = str.toLowerCase();
      str = str.replace(/[.,\/#!$%\^&\*;:{}=\-'_`~()]/g,"");
      str = str.replace(/\s{2,}/g,"");
      return str.removeStopWords();
    } else { // if answer is anything else, just return the answer
      return str;
    }
}

function answerTimer() {
  // once buzzed in, times how long they have to type the answer of the question
  // when someone clicks a category, it waits and then auto exits if no answer
  QUESTIONANSWERED = false;
  let timeleft = 9; // should match whatever the progress bar max is in html
  let progressBar = document.querySelector('#answerBar');
  progressBar.style.display = "block";
  let questionTimer = setInterval(function(){
      progressBar.value = 10 - timeleft; // first number should be timeleft +1
      timeleft -= 1;
      if (QUESTIONANSWERED) {
        QUESTIONANSWERED = false;
        progressBar.style.display = "none";
        progressBar.value = 0;
        clearInterval(questionTimer);
        return QUESTIONANSWERED; // resets questionanswered global variable for next question
      } else if(timeleft <= 0) {
        progressBar.style.display = "none";
        progressBar.value = 0;
        clearInterval(questionTimer);
        missedQuestion();
      }
  }, 1000);
}

function waitForBuzz() {
  // after user selects question, question shows, if user presses a key, then show answer box, then start answer timer. If user doesn't tap, then goes to next answer.
  CANBUZZ = true;
  let timeleft = 80;
  let questionBar = document.querySelector('#questionBar');
  questionBar.style.display = "block";
  let buzzTimer = setInterval(() => {
    timeleft -= 1;
    if (timeleft % 10 === 0) {
      questionBar.value = 81 - timeleft;
    }
    if (BUZZED) {
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
  } 
}

function contestantBuzzedMobile(event) {
  if (event.changedTouches.length && CANBUZZ) {
    const answer = document.querySelector('#answerField');
    answer.style.display = "inline-block";
    answer.focus();
    answer.select();
    answerTimer();
    BUZZED = true;
  }
}

// ============ BETTING FUNCTIONS ============

function setBet() {
  // shows bet container, allows user to make a bet for the question
  const betContainer = document.querySelector('.betContainer');
  const betText = document.querySelector('#betText');
  const bet = document.querySelector('#betField');
  let score = document.querySelector('.score').dataAttribute.Score;
  if (ROUND !== 3) {  
    if (score < ROUND * BASEAMOUNT * 5) { // jeopardy rules that if you are betting at less than 1000, you can bet up to 1000
      score = ROUND * BASEAMOUNT * 5;
    }
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
  if (ROUND < 3) {
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
  } else if (ROUND === 3) {
    if (!Number.isInteger(userBet)) { // makes them enter a number
      betField.focus();
      betField.select();
      return;
    } else if (userBet > totalScore) { // cant bet more than they have
      betField.focus();
      betField.select();
      return
    } else if (userBet < 0) {
      betField.focus();
      betField.select();
      return
    }
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
  let href = getHref(answer.dataAttribute.Question);
  if (href) {
    populateImg(href);
    question.textContent = removeAnchors(answer.dataAttribute.Question)
  } else {
    question.textContent = answer.dataAttribute.Question;
  }
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
  let href = getHref(arrayObject[2][0].Question);
  if (href) {
    populateImg(href);
    question.textContent = removeAnchors(arrayObject[2][0].Question)
  } else {
    question.textContent = arrayObject[2][0].Question;
  }
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
  let name = userObject.username; // update to be username
  text.textContent = `Congratulations ${name}! Your final score was: ${score.dataAttribute.Score}`;
  const form = document.createElement('form');
  form.method = "POST";
  const userIdInput = document.createElement('input');
  userIdInput.name = "id";
  userIdInput.value = userObject.user_id || 1;
  userIdInput.style.display = "none";
  appendFormInput(form, 'Score');
  const dateInput = document.createElement('input');
  dateInput.name = 'date';
  dateInput.value = new Date();
  dateInput.style.display = "none";
  appendFormInput(form, 'jeopardyQuestionsCorrect');
  appendFormInput(form, 'jeopardyQuestionsIncorrect');
  appendFormInput(form, `jeopardyQuestionsNotAnswered`);
  appendFormInput(form, `dJeopardyQuestionsCorrect`);
  appendFormInput(form, 'dJeopardyQuestionsIncorrect');
  appendFormInput(form, 'dJeopardyQuestionsNotAnswered');
  appendFormInput(form, `fJeopardyCorrect`);
  appendFormInput(form, 'fJeopardyIncorrect');
  const episodePlayed = document.createElement('input');
  episodePlayed.name = "episodePlayed";
  episodePlayed.value = arrayObject[0][0]["Show Number"];
  episodePlayed.style.display = "none";
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Post Score';
  form.appendChild(userIdInput);
  form.appendChild(dateInput);
  form.appendChild(episodePlayed);
  form.appendChild(submit);
  jeopardyHeader.appendChild(form);
}

function appendFormInput(element, string) {
  const input = document.createElement('input');
  const score = document.querySelector('.score');
  input.name = string;
  input.value = score.dataAttribute[string];
  input.style.display = "none";
  element.appendChild(input);
}

function showError() {
  let jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = "flex";
  let headerText = "Game data corrupted. Redirecting to home page";
  let round = document.querySelector('.round');
  round.textContent = headerText;
  let timeleft = 3;
  let headerTimer = setInterval(function(){
    timeleft -= 1;
    if(timeleft <= 0) {
      window.location.replace(window.location.href.split('/game')[0]);
    }
    }, 1000);
}


function checkForData(obj=arrayObject) {
  if (obj[0].length !== 30 || obj[1].length !== 30 || obj[2].length !== 1) {
    // shows error about corrupt game data and redirects to home page
    showError();
  } else {
    // starts up the game
    getBaseAmount(); // sets the initial question values $100, $200 etc.
    populateBoardDOM(arrayObject[0], ROUND); // MAIN FUNCTION, checkBoard runs the rest of the game
    setInitialScore(); // adds initial score dataAttribute to avoid possible buggy behavior
    setInitialAnswerAttribute(); // adds dataAttribute to answer to avoid possible buggy behavior
    addAnswerCheck(); // never removed
    addBetCheck(); // never removed
    addBuzzer(); // never removed
  }
}

// ============ FUNCTIONS RUN AT BEGINNING OF GAME ============

checkForData(); // checks to make sure data is good and then starts game

/* Gotten from the internet to make this work a bit better
 * String method to remove stop words
 * Written by GeekLad http://geeklad.com
 * Stop words obtained from http://www.lextek.com/manuals/onix/stopwords1.html
 *   Usage: string_variable.removeStopWords();
 *   Output: The original String with stop words removed
 */
String.prototype.removeStopWords = function() {
	var x;
	var y;
	var word;
	var stop_word;
	var regex_str;
	var regex;
	var cleansed_string = this.valueOf();
	var stop_words = new Array(
		'a',
		'about',
		'above',
		'across',
		'after',
		'again',
		'against',
		'all',
		'almost',
		'alone',
		'along',
		'already',
		'also',
		'although',
		'always',
		'among',
		'an',
		'and',
		'another',
		'any',
		'anybody',
		'anyone',
		'anything',
		'anywhere',
		'are',
		'area',
		'areas',
		'around',
		'as',
		'ask',
		'asked',
		'asking',
		'asks',
		'at',
		'away',
		'b',
		'back',
		'backed',
		'backing',
		'backs',
		'be',
		'became',
		'because',
		'become',
		'becomes',
		'been',
		'before',
		'began',
		'behind',
		'being',
		'beings',
		'best',
		'better',
		'between',
		'big',
		'both',
		'but',
		'by',
		'c',
		'came',
		'can',
		'cannot',
		'case',
		'cases',
		'certain',
		'certainly',
		'clear',
		'clearly',
		'come',
		'could',
		'd',
		'did',
		'differ',
		'different',
		'differently',
		'do',
		'does',
		'done',
		'down',
		'down',
		'downed',
		'downing',
		'downs',
		'during',
		'e',
		'each',
		'early',
		'either',
		'end',
		'ended',
		'ending',
		'ends',
		'enough',
		'even',
		'evenly',
		'ever',
		'every',
		'everybody',
		'everyone',
		'everything',
		'everywhere',
		'f',
		'face',
		'faces',
		'fact',
		'facts',
		'far',
		'felt',
		'few',
		'find',
		'finds',
		'first',
		'for',
		'four',
		'from',
		'full',
		'fully',
		'further',
		'furthered',
		'furthering',
		'furthers',
		'g',
		'gave',
		'general',
		'generally',
		'get',
		'gets',
		'give',
		'given',
		'gives',
		'go',
		'going',
		'good',
		'goods',
		'got',
		'great',
		'greater',
		'greatest',
		'group',
		'grouped',
		'grouping',
		'groups',
		'h',
		'had',
		'has',
		'have',
		'having',
		'he',
		'her',
		'here',
		'herself',
		'high',
		'high',
		'high',
		'higher',
		'highest',
		'him',
		'himself',
		'his',
		'how',
		'however',
		'i',
		'if',
		'important',
		'in',
		'interest',
		'interested',
		'interesting',
		'interests',
		'into',
		'is',
		'it',
		'its',
		'itself',
		'j',
		'just',
		'k',
		'keep',
		'keeps',
		'kind',
		'knew',
		'know',
		'known',
		'knows',
		'l',
		'large',
		'largely',
		'last',
		'later',
		'latest',
		'least',
		'less',
		'let',
		'lets',
		'like',
		'likely',
		'long',
		'longer',
		'longest',
		'm',
		'made',
		'make',
		'making',
		'man',
		'many',
		'may',
		'me',
		'member',
		'members',
		'men',
		'might',
		'more',
		'most',
		'mostly',
		'mr',
		'mrs',
		'much',
		'must',
		'my',
		'myself',
		'n',
		'necessary',
		'need',
		'needed',
		'needing',
		'needs',
		'never',
		'new',
		'new',
		'newer',
		'newest',
		'next',
		'no',
		'nobody',
		'non',
		'noone',
		'not',
		'nothing',
		'now',
		'nowhere',
		'number',
		'numbers',
		'o',
		'of',
		'off',
		'often',
		'old',
		'older',
		'oldest',
		'on',
		'once',
		'one',
		'only',
		'open',
		'opened',
		'opening',
		'opens',
		'or',
		'order',
		'ordered',
		'ordering',
		'orders',
		'other',
		'others',
		'our',
		'out',
		'over',
		'p',
		'part',
		'parted',
		'parting',
		'parts',
		'per',
		'perhaps',
		'place',
		'places',
		'point',
		'pointed',
		'pointing',
		'points',
		'possible',
		'present',
		'presented',
		'presenting',
		'presents',
		'problem',
		'problems',
		'put',
		'puts',
		'q',
		'quite',
		'r',
		'rather',
		'really',
		'right',
		'right',
		'room',
		'rooms',
		's',
		'said',
		'same',
		'saw',
		'say',
		'says',
		'second',
		'seconds',
		'see',
		'seem',
		'seemed',
		'seeming',
		'seems',
		'sees',
		'several',
		'shall',
		'she',
		'should',
		'show',
		'showed',
		'showing',
		'shows',
		'side',
		'sides',
		'since',
		'small',
		'smaller',
		'smallest',
		'so',
		'some',
		'somebody',
		'someone',
		'something',
		'somewhere',
		'state',
		'states',
		'still',
		'still',
		'such',
		'sure',
		't',
		'take',
		'taken',
		'than',
		'that',
		'the',
		'their',
		'them',
		'then',
		'there',
		'therefore',
		'these',
		'they',
		'thing',
		'things',
		'think',
		'thinks',
		'this',
		'those',
		'though',
		'thought',
		'thoughts',
		'three',
		'through',
		'thus',
		'to',
		'today',
		'together',
		'too',
		'took',
		'toward',
		'turn',
		'turned',
		'turning',
		'turns',
		'two',
		'u',
		'under',
		'until',
		'up',
		'upon',
		'us',
		'use',
		'used',
		'uses',
		'v',
		'very',
		'w',
		'want',
		'wanted',
		'wanting',
		'wants',
		'was',
		'way',
		'ways',
		'we',
		'well',
		'wells',
		'went',
		'were',
		'what',
		'when',
		'where',
		'whether',
		'which',
		'while',
		'who',
		'whole',
		'whose',
		'why',
		'will',
		'with',
		'within',
		'without',
		'work',
		'worked',
		'working',
		'works',
		'would',
		'x',
		'y',
		'year',
		'years',
		'yet',
		'you',
		'young',
		'younger',
		'youngest',
		'your',
		'yours',
		'z'
	)

	// Split out all the individual words in the phrase
	words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)

	// Review all the words
	for(x=0; x < words.length; x++) {
		// For each word, check all the stop words
		for(y=0; y < stop_words.length; y++) {
			// Get the current word
			word = words[x].replace(/\s+|[^a-z]+/ig, "");	// Trim the word and remove non-alpha

			// Get the stop word
			stop_word = stop_words[y];

			// If the word matches the stop word, remove it from the keywords
			if(word.toLowerCase() == stop_word) {
				// Build the regex
				regex_str = "^\\s*"+stop_word+"\\s*$";		// Only word
				regex_str += "|^\\s*"+stop_word+"\\s+";		// First word
				regex_str += "|\\s+"+stop_word+"\\s*$";		// Last word
				regex_str += "|\\s+"+stop_word+"\\s+";		// Word somewhere in the middle
				regex = new RegExp(regex_str, "ig");

				// Remove the word from the keywords
				cleansed_string = cleansed_string.replace(regex, " ");
			}
		}
	}
	return cleansed_string.replace(/^\s+|\s+$/g, "");
} 