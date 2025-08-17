// ملف script.js

// الكلمات الإنجليزية والعربية
const words = [
    { english: "Archaeologist", arabic: "عالم آثار" },
    { english: "Archaeological Sites", arabic: "مواقع أثرية" },
    { english: "Above the Ground", arabic: "فوق الأرض" },
    { english: "Discover", arabic: "يكتشف" },
    { english: "Fake Location", arabic: "موقع وهمي" },
    { english: "Realistic Photos", arabic: "صور واقعية" },
    { english: "Satellite", arabic: "قمر صناعي" },
    { english: "GPS", arabic: "نظام تحديد المواقع" },
    { english: "GPR", arabic: "الرادار المخترق للأرض" },
    { english: "Buried Objects", arabic: "أشياء مدفونة" },
    { english: "Save Time", arabic: "يوفر الوقت" },
    { english: "Save Effort", arabic: "يوفر الجهد" },
    { english: "Built Objects", arabic: "أجسام مبنية" },
    { english: "Guide", arabic: "دليل" },
    { english: "To find", arabic: "للبحث / لإيجاد" }
];

// متغيرات اللعبة
let currentQuestion = 0;
let score = 0;
let isEnglishToArabic = true;
let gameMode = "multiple";
let studentName = "";
let shuffledWords = [];
let correctAnswer = "";

// عناصر DOM
const welcomePage = document.getElementById('welcomePage');
const testPage = document.getElementById('testPage');
const resultPage = document.getElementById('resultPage');
const startBtn = document.getElementById('startBtn');
const studentNameInput = document.getElementById('studentName');
const testOptionBtns = document.querySelectorAll('.test-option-btn');
const gameModeBtns = document.querySelectorAll('.game-mode-btn');
const studentNameDisplay = document.getElementById('studentNameDisplay');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('optionsContainer');
const typingContainer = document.getElementById('typingContainer');
const answerInput = document.getElementById('answerInput');
const checkAnswerBtn = document.getElementById('checkAnswer');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const currentScoreElement = document.getElementById('currentScore');
const feedbackMessage = document.getElementById('feedbackMessage');
const resultContent = document.getElementById('resultContent');
const resultTitle = document.getElementById('resultTitle');
const studentResultName = document.getElementById('studentResultName');
const finalScoreElement = document.getElementById('finalScore');
const resultMessage = document.getElementById('resultMessage');
const playAgainBtn = document.getElementById('playAgainBtn');
const changeTestBtn = document.getElementById('changeTestBtn');
const trophy = document.getElementById('trophy');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const winSound = document.getElementById('winSound');

// تهيئة الأصوات
correctSound.volume = 0.3;
wrongSound.volume = 0.3;
winSound.volume = 0.5;

// اختيار نوع الاختبار
testOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        testOptionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        isEnglishToArabic = btn.dataset.test === 'englishToArabic';
    });
});

// اختيار نمط اللعب
gameModeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        gameModeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameMode = btn.dataset.mode;
    });
});

// بدء الاختبار
startBtn.addEventListener('click', () => {
    if (studentNameInput.value.trim() === '') {
        studentNameInput.focus();
        studentNameInput.style.borderColor = 'var(--wrong-color)';
        setTimeout(() => {
            studentNameInput.style.borderColor = '#D7CCC8';
        }, 1000);
        return;
    }

    studentName = studentNameInput.value.trim();
    startGame();
});

// بدء اللعبة
function startGame() {
    currentQuestion = 0;
    score = 0;
    shuffledWords = shuffleArray([...words]);
    
    welcomePage.style.display = 'none';
    testPage.style.display = 'block';
    resultPage.style.display = 'none';
    
    studentNameDisplay.textContent = studentName;
    currentScoreElement.textContent = score;
    
    showQuestion();
}

// عرض السؤال
function showQuestion() {
    if (currentQuestion >= shuffledWords.length) {
        showResults();
        return;
    }
    
    // تحديث شريط التقدم
    const progressPercent = (currentQuestion / shuffledWords.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${currentQuestion + 1}/${shuffledWords.length}`;
    
    const word = shuffledWords[currentQuestion];
    correctAnswer = isEnglishToArabic ? word.arabic : word.english;
    
    // عرض السؤال
    questionElement.textContent = isEnglishToArabic ? word.english : word.arabic;
    questionElement.className = 'question animate__animated animate__fadeIn';
    
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
    
    if (gameMode === 'multiple') {
        typingContainer.style.display = 'none';
        optionsContainer.style.display = 'grid';
        showMultipleChoiceOptions(word);
    } else {
        optionsContainer.style.display = 'none';
        typingContainer.style.display = 'flex';
        answerInput.value = '';
        answerInput.focus();
    }
    
    nextBtn.style.display = 'none';
    checkAnswerBtn.style.display = 'block';
}

// عرض خيارات متعددة
function showMultipleChoiceOptions(correctWord) {
    optionsContainer.innerHTML = '';
    
    // إنشاء قائمة بالكلمات الأخرى للإجابات الخاطئة
    let otherWords = shuffledWords.filter(w => w !== correctWord);
    otherWords = shuffleArray(otherWords).slice(0, 3);
    
    // إنشاء قائمة بالإجابات (صحيحة + 3 خاطئة)
    const options = [correctWord, ...otherWords];
    const shuffledOptions = shuffleArray(options);
    
    shuffledOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option', 'animate__animated', 'animate__fadeInUp');
        
        optionElement.textContent = isEnglishToArabic ? option.arabic : option.english;
        
        optionElement.addEventListener('click', () => {
            if (optionElement.classList.contains('selected')) return;
            
            const isCorrect = option === correctWord;
            selectOption(optionElement, isCorrect);
        });
        
        optionsContainer.appendChild(optionElement);
    });
}

// اختيار إجابة
function selectOption(selectedOption, isCorrect) {
    // تعطيل جميع الأزرار
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // تأثيرات الإجابة
    if (isCorrect) {
        selectedOption.classList.add('correct', 'animate__tada');
        correctSound.play();
        score++;
        currentScoreElement.textContent = score;
        feedbackMessage.textContent = 'إجابة صحيحة! أحسنت!';
        feedbackMessage.classList.add('correct');
    } else {
        selectedOption.classList.add('wrong', 'animate__headShake');
        wrongSound.play();
        feedbackMessage.textContent = 'إجابة خاطئة! حاول مرة أخرى!';
        feedbackMessage.classList.add('wrong');
        
        // إظهار الإجابة الصحيحة
        options.forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add('correct', 'animate__pulse');
            }
        });
    }
    
    nextBtn.style.display = 'flex';
}

// التحقق من الإجابة المكتوبة
function checkTypedAnswer() {
    const userAnswer = answerInput.value.trim();
    
    if (userAnswer === '') {
        answerInput.style.borderColor = 'var(--wrong-color)';
        setTimeout(() => {
            answerInput.style.borderColor = '#D7CCC8';
        }, 1000);
        return;
    }
    
    let isCorrect;
    if (isEnglishToArabic) {
        isCorrect = userAnswer === correctAnswer;
    } else {
        isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    }
    
    if (isCorrect) {
        answerInput.style.borderColor = 'var(--correct-color)';
        correctSound.play();
        score++;
        currentScoreElement.textContent = score;
        feedbackMessage.textContent = 'إجابة صحيحة! أحسنت!';
        feedbackMessage.classList.add('correct');
    } else {
        answerInput.style.borderColor = 'var(--wrong-color)';
        wrongSound.play();
        feedbackMessage.textContent = isEnglishToArabic 
            ? `إجابة خاطئة! الإجابة الصحيحة: ${correctAnswer}`
            : `Wrong answer! Correct answer: ${correctAnswer}`;
        feedbackMessage.classList.add('wrong');
    }
    
    nextBtn.style.display = 'flex';
    checkAnswerBtn.style.display = 'none';
}

// عرض النتائج
function showResults() {
    testPage.style.display = 'none';
    resultPage.style.display = 'block';
    
    const percentage = (score / shuffledWords.length) * 100;
    finalScoreElement.textContent = `${score}/${shuffledWords.length}`;
    studentResultName.textContent = studentName;
    
    // تحديد الرسالة بناء على النتيجة
    if (percentage >= 90) {
        resultTitle.textContent = 'ممتاز! أنت عالم آثار رائع!';
        resultMessage.textContent = `مبروك ${studentName}! لقد أظهرت معرفة رائعة بمصطلحات الآثار. تستحق أن تكون عالم آثار صغير!`;
        trophy.textContent = '🏆';
        createConfetti();
    } else if (percentage >= 70) {
        resultTitle.textContent = 'جيد جداً!';
        resultMessage.textContent = `أحسنت ${studentName}! لديك فهم جيد لمصطلحات الآثار، يمكنك تحسين نتائجك بالمزيد من الممارسة.`;
        trophy.textContent = '🎖️';
    } else if (percentage >= 50) {
        resultTitle.textContent = 'ليس سيئاً!';
        resultMessage.textContent = `حاولت جيداً ${studentName}! مع بعض المراجعة ستتحسن بالتأكيد. تذكر أن كل عالم آثار عظيم بدأ من حيث أنت الآن.`;
        trophy.textContent = '👍';
    } else {
        resultTitle.textContent = 'حاول مرة أخرى!';
        resultMessage.textContent = `لا تقلق ${studentName}! الآثار علم يحتاج للصبر والممارسة. جرب مرة أخرى وسترى التحسن.`;
        trophy.textContent = '💪';
    }
    
    // تأثيرات النجاح
    if (percentage >= 70) {
        winSound.play();
        trophy.classList.add('animate__tada');
        resultContent.classList.add('animate__bounceIn');
    } else {
        resultContent.classList.add('animate__fadeIn');
    }
}

// إنشاء تأثير الكونفيتي
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        resultContent.appendChild(confetti);
        
        // إزالة الكونفيتي بعد انتهاء الأنيميشن
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// الحصول على لون عشوائي
function getRandomColor() {
    const colors = ['#FFC107', '#4CAF50', '#2196F3', '#F44336', '#9C27B0'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// إعادة ترتيب المصفوفة عشوائياً
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// الأحداث
checkAnswerBtn.addEventListener('click', checkTypedAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkTypedAnswer();
    }
});

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    showQuestion();
    answerInput.style.borderColor = '#D7CCC8';
    checkAnswerBtn.style.display = 'block';
});

playAgainBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
    testPage.style.display = 'block';
    startGame();
});

changeTestBtn.addEventListener('click', () => {
    resultPage.style.display = 'none';
    welcomePage.style.display = 'flex';
    welcomePage.classList.add('animate__fadeIn');
});

// تهيئة اللعبة
function init() {
    // تعيين النمط الافتراضي
    document.querySelector('.test-option-btn[data-test="englishToArabic"]').classList.add('active');
    document.querySelector('.game-mode-btn[data-mode="multiple"]').classList.add('active');
}

init();