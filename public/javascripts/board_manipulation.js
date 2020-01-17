let questionAnswered = false;
let ROUND = 1;

// TODO: Export Data after game ends
// TODO: add answer page after score
// TODO: Figure out how to manipulate string text when image or <a> should be shown
// TODO: Fix answers that are not text and instead are just strings
// TODO: Make categories expand for mobiles
// TODO: Make end screen
// TODO: Make final jeopardy not run if score is less than 0
// TODO: Find game breaking bug that happens after second daily double, sometimes




function finalJeopardy() {
  showRound(3);
  setTimeout(() => {
    finalJeopardyCategory();
    setTimeout(() => {
      setBet();
    }, 3000)
  }, 3000);
}



function populateQuestionFinalJeopardy() {
  // when question is clicked, updates result box with question, updates resultbox question value, removes question
  let questionContainer = document.querySelector('.questionContainer');
  let question = document.querySelector('#questionText');
  let answer = document.querySelector('#answerField');
  answer.dataAttribute.Answer = arrayObject[2][0].Answer;
  question.textContent = arrayObject[2][0].Question;
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
  const betContainer = document.querySelector('.betContainer');
  const betText = document.querySelector('#betText');
  const bet = document.querySelector('#betField');
  let score = document.querySelector('.score').dataAttribute.Score;
  if (score < 1000) {
    score = 1000;
  }
  betText.textContent = `Enter in a wager up to ${score}`;
  betContainer.style.display = "flex";
  // puts cursor in answerField
  bet.focus();
  bet.select();
}

function checkBet(event) {
  const userBet = parseInt(event.target.value);
  const totalScore = document.querySelector('.score').dataAttribute.Score;
  const betField = document.querySelector('#betField');
  if (userBet < 5) {
    betField.focus();
    betField.select();
    return;
  } else if (!Number.isInteger(userBet)) {
    betField.focus();
    betField.select();
    return;
  } else if (totalScore < 1000) {
    if (userBet > 1000) {
      betField.focus();
      betField.select();
      return
    }
  } else if (userBet > totalScore) {
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
  if (ROUND === 3) {
    populateQuestionFinalJeopardy();
  } else {
    populateDDQuestion();
  }
}

function populateDDQuestion() {
  const questionContainer = document.querySelector('.questionContainer');
  const question = document.querySelector('#questionText');
  const answer = document.querySelector('#answerField');
  question.textContent = answer.dataAttribute.Question;
  // changes display from none to flex to show question
  questionContainer.style.display = "flex";
  // puts cursor in answerField
  answer.focus();
  answer.select();
}



function dailyDouble(event) {
  showDailyDouble();
  setTimeout(() => {
    setBet();
  }, 3000)
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

function setInitialScore() {
  let userScore = document.querySelector('.score');
  userScore.dataAttribute = {
    Score: 0
  };
}

function updateScoreDOM(score) {
    let userScore = document.querySelector('.score');
    let currentScore = userScore.dataAttribute.Score;
    if (score + currentScore < 0) {
      const resultContainer = document.querySelector('.resultContainer');
      resultContainer.style.backgroundColor = "red";
    } else {
      const resultContainer = document.querySelector('.resultContainer');
      resultContainer.style.backgroundColor = "#0314a2";
    }
    userScore.textContent = `Score: $${currentScore + score}`;
    userScore.dataAttribute.Score = currentScore + score;
}

function removeQuestionDOM(event) {
    event.target.textContent = "";
    event.target.removeEventListener("click", removeQuestionDOM);
    event.target.removeEventListener('click', populateQuestionDOM);
    event.target.removeEventListener('click', dailyDouble);
    event.target.dataAttribute = {
      "Answer": null,
      "Value": null,
      "Question": null
    };
}
    
function checkBoard() {
  let questions = document.querySelectorAll('.question-item');
  let done = false;
  for (let question of questions) {
    if (question.textContent.length > 0) {
      return; // exits out of function if any questions have text remaining
    }
  }
  if (ROUND === 1) {
    ROUND = 2;
    populateBoardDOM(arrayObject[1], 2); // only runs if all questions have no text
    return ROUND;
  } else if (ROUND === 2) {
    ROUND = 3;
    finalJeopardy();
    return ROUND;
  } else if (ROUND === 3) {
    console.log('game over');
  }
}

function populateBoardDOM(obj=arrayObject, roundNumber=ROUND) {
    // takes show object, updates text content of each block, adds onclick to each block
    // five questions, six categories
    showRound(roundNumber);
    resetQuestionsDOM(roundNumber); // change 1 to whatever round it is
    populateCategoriesDOM(obj);
    populateQuestionsDOM(obj, roundNumber);
}

function resetQuestionsDOM(factor) {
    for (let i=1;i<7;i++) {
        let questionArr = document.querySelectorAll(`.question${i}`);
        questionArr.forEach(element => {
            element.textContent = `$${i * factor * 200}`;
            element.dataAttribute = {
              Answer: null,
              Question: null,
              Value: null
            };
            element.removeEventListener("click", populateQuestionDOM);
            element.removeEventListener('click', dailyDouble);
            element.removeEventListener('click', removeQuestionDOM);
            element.removeEventListener('click', answerTimer);
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
        };
        if ("$" + questionValue !== questionsDOMArray[i].textContent) { // if the value of the question doesn't match what the value should be, makes it a daily double
          questionsDOMArray[i].addEventListener('click', dailyDouble); // daily double question events
          questionsDOMArray[i].addEventListener('click', populateQuestionDOM);
          questionsDOMArray[i].addEventListener('click', removeQuestionDOM);
        } else { // regular question events
          questionsDOMArray[i].addEventListener('click', populateQuestionDOM);
          questionsDOMArray[i].addEventListener('click', removeQuestionDOM);
          questionsDOMArray[i].addEventListener('click', answerTimer);
        }
    }
}
 
function populateQuestionDOM(event) {
    // when question is clicked, updates result box with question, updates resultbox question value, removes question
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
    answer.focus();
    answer.select();
}

function resetQuestionContainer() {
    // empties the answer box
    let questionContainer = document.querySelector('.questionContainer');
    let question = document.querySelector('#questionText');
    let answer = document.querySelector('#answerField');
    answer.dataAttribute = {
      Answer: null,
      Question: null,
      Value: null
    };
    question.textContent = "";
    questionContainer.style.display = "none";
    checkBoard();
}

function addAnswerCheck() {
    let answer = document.querySelector('#answerField');
    // change triggers when value for input field changed and focus lost or submitted
    answer.addEventListener('change', checkIfRight);
}

function addBetCheck() {
  let bet = document.querySelector('#betField');
  bet.addEventListener('change', checkBet);
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

function sendDataToBackend() {
    // after game is done, sends game data back to backend
}

function populateFinalScore() {
  let formDiv = document.createElement('div');
  formDiv.className = 'submitForm';
  let congratulations = document.createElement('h2');
  let userName = document.createElement('h4');
  let paragraph = document.createElement('p');
  let score = document.querySelector('.score').dataAttribute.Value;


}


function setInitialAnswerAttribute() {
  const answer = document.querySelector('#answerField');
  answer.dataAttribute = {
    Question: null,
    Value: null,
    Answer: null
  }
}
populateBoardDOM(arrayObject[0], 1);
setInitialScore();
setInitialAnswerAttribute();
addAnswerCheck();
addBetCheck();
// bug in daily doubles where value = 1000?