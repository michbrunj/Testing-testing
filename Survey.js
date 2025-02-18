document.addEventListener('DOMContentLoaded', function () {
  const farmTypeDropdown = document.getElementById('farm-type');
  const startSurveyButton = document.getElementById('start-survey');
  const questionContainer = document.getElementById('question-container');
  const questionLabel = document.getElementById('question-label');
  const questionSelect = document.getElementById('question-select');
  const nextQuestionButton = document.getElementById('next-question');
  const calculateButton = document.getElementById('calculate-button');

  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let totalSOCPotential = 0;
  let responses = [];

  // Create Back Button
  const backButton = document.createElement('button');
  backButton.textContent = "Back";
  backButton.style.display = "none";
  backButton.style.marginRight = "10px";
  questionContainer.insertBefore(backButton, nextQuestionButton);

  farmTypeDropdown.addEventListener('change', function () {
    const farmType = this.value;
    currentQuestions = getQuestionsForFarmType(farmType);
    currentQuestionIndex = 0;
    totalSOCPotential = 0;
    responses = [];

    if (currentQuestions.length > 0) {
      startSurveyButton.style.display = 'block';
    } else {
      startSurveyButton.style.display = 'none';
    }
  });

  startSurveyButton.addEventListener('click', function () {
    startSurveyButton.style.display = 'none';
    questionContainer.style.display = 'block';
    showQuestion();
  });

  nextQuestionButton.addEventListener('click', function () {
    const selectedValue = questionSelect.value;
    if (!selectedValue) {
      alert("Please select an answer before continuing.");
      return;
    }

    const socValues = JSON.parse(questionSelect.dataset.socValues);
    const selectedSOC = socValues[selectedValue];

    // Adjust calculation for negative values
    const maxPotential = Object.values(socValues).reduce((max, value) => Math.max(max, value), 0);
    const adjustedSOC = maxPotential + selectedSOC;
    totalSOCPotential += adjustedSOC;

    responses[currentQuestionIndex] = {
      question: currentQuestions[currentQuestionIndex].text,
      selectedOption: selectedValue,
      socValue: adjustedSOC
    };

    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
      showQuestion();
    } else {
      questionContainer.style.display = 'none';
      calculateButton.style.display = 'block';
    }

    backButton.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
  });

  backButton.addEventListener('click', function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      totalSOCPotential -= responses[currentQuestionIndex].socValue || 0;
      showQuestion();
    }

    backButton.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
    calculateButton.style.display = "none";
  });

  document.getElementById('survey-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const farmName = document.getElementById('farm-name').value;
    const farmLocation = document.getElementById('farm-location').value;
    const farmSize = parseFloat(document.getElementById('farm-size').value);
    const farmType = document.getElementById('farm-t
