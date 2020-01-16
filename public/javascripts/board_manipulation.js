let questionAnswered = false;



// TODO: Make final jeopardy functionality
//      Allow players to enter score to wager (changes value of question)
//      Answer question, then go back to next person
// TODO: Add daily double functionality (happens when values are not exactly 4, 8, 12, 16, 20 etc.)
// TODO: add answer page after score


// TODO: Figure out how to manipulate string text when image or <a> should be shown
// TODO: Fix editing text breaks score
// TODO: Make it playable by multiple people
// TODO: Export Data after game ends
// TODO: Make alex page??????
// TODO: Make categories expand for mobiles

function finalJeopardy() {
  showRound(3);
  setTimeout(() => {
    finalJeopardyCategory();
    setTimeout(() => {
      const bet = document.querySelector('#answerField');
      bet.addEventListener('change', checkBet);
      bet.addEventListener('change', answerTimer);
      setBet();
      bet.removeEventListener('change', checkBet);
      bet.addEventListener('change', checkIfRight);
      populateQuestionFinalJeopardy();
    }, 3000)
  }, 3000);
}

function populateQuestionFinalJeopardy() {
  // when question is clicked, updates result box with question, updates resultbox question value, removes question
  let questionContainer = document.querySelector('.questionContainer');
  let question = document.querySelector('#questionText');
  let answer = document.querySelector('#answerField');
  answer.dataAttribute = {
      "Answer": arrayObject[2].Answer,
  };
  question.textContent = arrayObject[2].Question;
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  answer.focus();
  answer.select();
}

function finalJeopardyCategory() {
  let jeopardyHeader = document.querySelector('.jeopardyHeader');
  jeopardyHeader.style.display = "flex";
  let categoryText = arrayObject[2][0].Category;
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

function setBet() {
  const questionContainer = document.querySelector('.questionContainer');
  const betText = document.querySelector('#questionText');
  const answer = document.querySelector('#answerField');
  let score = document.querySelector('.score').dataAttribute;
  betText.textContent = `Enter in a wager up to ${score}`;
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  answer.focus();
  answer.select();
  // answer.dataAttribute = {
  //   "Answer": event.target.dataAttribute.Answer,
  //   "Value": event.target.dataAttribute.Value
  // };
}

// when populating dom, check for non divisible answers
// on these, give them a different onclick event
// on click event should show daily double page, then
// show a bet page,
// check their bet,
// change the value of the answer box to be that value
// then populate the question area with proper stuff

function checkBet(event) {
  const userBet = event.target.value;
  const totalScore = document.querySelector('.score').dataAttribute;
  // if (userBet > totalScore) {
  //   const betText = document.querySelector('#questionText');
  //   betText.textContent = `Wager higher than score`;
  //   setBet();
  //   return;
  // } else {
  //   const 
  // }
  const answer = document.querySelector('#answerField');
  const question = document.querySelector('#questionText');
  answer.dataAttribute = {
    "Value": userBet
  };
  question.textContent = "";
}



function dailyDouble(event) {
  showDailyDouble();
  setBet();
  checkBet(event);
  populateQuestionDOM(event);
}

function showDailyDouble() {
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

function makeBet() {
  let bet = document.querySelector('.score').value;

}

function showRound(roundNumber) {
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

// final jeopardy = input a wager, check it against current score, then present question
function setInitialScore() {
  let userScore = document.querySelector('.score');
  userScore.dataAttribute = {
    Score: 0
  };
}

function updateScoreDOM(score) {
    let userScore = document.querySelector('.score');
    let currentScore = userScore.dataAttribute.Score;
    userScore.textContent = `Score: $${currentScore + score}`;
    userScore.dataAttribute.Score = currentScore + score;
}

function removeQuestionDOM(event) {
    event.target.textContent = "";
    event.target.removeEventListener("click", removeQuestionDOM);
    event.target.dataAttribute = null;
}
    
function checkBoard() {
  let questions = document.querySelectorAll('.question-item');
  let done = false;
  for (let question of questions) {
    if (question.textContent.length > 0) {
      return; // exits out of function if any questions have text remaining
    }
  }
  populateBoardDOM(arrayObject[1], 2); // only runs if all questions have no text
}

function populateBoardDOM(obj, roundNumber) {
    // takes show object, updates text content of each block, adds onclick to each block
    // five questions, six categories
    showRound(roundNumber);
    resetQuestionsDOM(roundNumber); // change 1 to whatever round it is
    populateCategoriesDOM(obj);
    populateQuestionsDOM(obj);
    addAnswerCheck();
}

function resetQuestionsDOM(factor) {
    for (let i=1;i<7;i++) {
        let questionArr = document.querySelectorAll(`.question${i}`);
        questionArr.forEach(element => {
            element.textContent = `$${i * factor * 200}`;
            element.addEventListener('click', populateQuestionDOM);
            element.addEventListener('click', removeQuestionDOM);
            element.addEventListener('click', answerTimer);
        });
    }
}

function populateCategoriesDOM(obj) {
    // grabs first six categories from object and makes category names
    const categoryDOMArray = document.querySelectorAll('.category-item');
    for (let i=0;i<6;i++) {
        categoryDOMArray[i].textContent = obj[i].Category;
    }
}

function populateQuestionsDOM(obj) {
    // grabs each category of questions, and adds data to each element of category
    const questionsDOMArray = document.querySelectorAll('.question-item');
    for (let i=0;i<obj.length;i++) {
        questionsDOMArray[i].dataAttribute = {
            "Question": obj[i].Question,
            "Answer": obj[i].Answer,
            "Value": obj[i].Value
        };
    }
}
 
function populateQuestionDOM(event) {
    // when question is clicked, updates result box with question, updates resultbox question value, removes question
    let questionContainer = document.querySelector('.questionContainer');
    let question = document.querySelector('#questionText');
    let answer = document.querySelector('#answerField');
    answer.dataAttribute = {
        "Answer": event.target.dataAttribute.Answer,
        "Value": event.target.dataAttribute.Value
    };
    question.textContent = event.target.dataAttribute.Question;
    // changes display from none to flex to show question
    questionContainer.style.display = "flex";
    // puts cursor in answerField
    answer.focus();
    answer.select();
}

function resetQuestionContainer() {
    // empties the answer box
    let questionContainer = document.querySelector('.questionContainer');
    let question = document.querySelector('#questionText');
    let answer = document.querySelector('#answerField');
    answer.dataAttribute = null;
    question.textContent = "";
    questionContainer.style.display = "none";
    checkBoard();
}

function addAnswerCheck() {
    let answer = document.querySelector('#answerField');
    // change triggers when value for input field changed and focus lost or submitted
    answer.addEventListener('change', checkIfRight);
}

function buzzTimer() {
    // When question selected, starts callback, exits when button clicked to allow typing
    // ?????????
    // let myVar = setTimeout(callback, milliseconds);
    // clearTimeout(myVar);
}

function answerTimer() {
    // once buzzed in, times how long they have to type the answer of the question
    // when someone clicks a category, it waits and then auto exits if no answer
    let timeleft = 9; // should match whatever the progress bar max is in html
    let progressBar = document.querySelector('#progressBar');
    let questionTimer = setInterval(function(){
        progressBar.value = 10 - timeleft; // first number should be timeleft +1
        timeleft -= 1;
        if (questionAnswered) {
          console.log('question answered')
          questionAnswered = false;
          progressBar.value = 0;
          clearInterval(questionTimer);
          return questionAnswered;
        } else if(timeleft <= 0) { // || globalSwitch.questionAnswered
          // resetQuestionAnswered();
          progressBar.value = 0;
          console.log('clearing interval')
          clearInterval(questionTimer);
          missedQuestion();
        }
    }, 1000);
}

function resetQuestionAnswered() {
  globalSwitch.questionAnswered = !questionAnswered;
  console.log(`questionAnswered=${globalSwitch[questionAnswered]}`);
}

function missedQuestion() {
    let answerValue = document.querySelector('#answerField').dataAttribute.Value;
    answerValue = parseInt(answerValue.slice(1));
    updateScoreDOM(answerValue * -1);
    resetQuestionContainer();
}

function checkIfRight(event) {
    // checks whether user input is correct
    let userAnswer = event.target.value;
    let correctAnswer = formatText(event.target.dataAttribute.Answer);
    let answerValue = event.target.dataAttribute.Value;
    answerValue = parseInt(answerValue.slice(1));
    if (userAnswer === correctAnswer) {
        console.log('right');
        updateScoreDOM(answerValue);
    } else {
        console.log('wrong');
        updateScoreDOM(answerValue * -1);
    }
    // resetQuestionAnswered();
    resetQuestionContainer();
    questionAnswered = true;
    return questionAnswered;
}

function formatText(str) {
    // changes users answer and question answer
    return str.toLowerCase();
}

function ifNoAnswers() {
    // update answer box to Next Question, resets answer box
}

function sendDataToBackend() {
    // after game is done, sends game data back to backend
}

populateBoardDOM(arrayObject[0], 1);
setInitialScore();