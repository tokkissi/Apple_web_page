let slides = document.querySelector(".slide__ul");
let slide = document.querySelectorAll(".slide__li");
// 현재 보는 슬라이드
let currentIdx = 0;
// 슬라이드의 수
let slideCount = slide.length;
// 각 슬라이드의 길이
let slideWidth = 200;
// 슬라이드별 margin
let slideMargin = 30;
// 이전가기 버튼
let prevBtn = document.querySelector(".slide--prev__btn");
// 다음 가기 버튼
let nextBtn = document.querySelector(".slide--next__btn");
// ul 의 부모 요소. 슬라이드가 보이는 부분인 요소
let slideWrap = document.querySelector(".slide__wrapper");
// timer 를 전역 변수로 선언하여 어디서든 사용하도록 한다
let timer = undefined;
// 페이지네이션 버튼들
let pagerbtns = document.querySelectorAll(".slide__pagination li");

// 기존 슬라이드들의 앞 뒤로 같은 크기의 클론을 붙여준다
makeClone();

function makeClone() {
  for (let i = 0; i < slideCount; i++) {
    // a.cloneNode() 는 해당 요소 복사하기. true 가 들어가면 자식 요소도 복사함
    let cloneSlide = slide[i].cloneNode(true);
    // 복사한 클론 슬라이드에 clone 클래스를 추가한다
    cloneSlide.classList.add("clone");
    // a.appendChild(b) a 의 자식으로 b를 추가한다.
    // 기존 슬라이드의 뒤에 클론 슬라이드들을 추가한다
    slides.appendChild(cloneSlide);
  }
  for (let i = slideCount - 1; i >= 0; i--) {
    let cloneSlide = slide[i].cloneNode(true);
    cloneSlide.classList.add("clone");
    // a.prepend(b)  a 의 앞에 b 요소를 추가한다
    // 기존 슬라이드의 앞에 클론 슬라이드를 추가한다
    slides.prepend(cloneSlide);
  }
  // ul 의 너비를 구하는 함수
  updateWidth();
  // ul의 초기 위치를 구하는 함수
  setInitialPos();
  // settimeout 으로 콜백으로 animated 클래스를 넣어 초기 ul 위치 translateX가 끝난 후에야 콜백으로 클래스 추가가 적용이 되게 한다
  setTimeout(() => {
    // ul 에 클래스를 추가해서 이동 시 animation 을 적용 시킨다
    slides.classList.add("animated");
  }, 100);
}

// 전체 슬라이드의 개수를 구하고,  각 슬라이드의 너비+마진을 곱하는 함수
function updateWidth() {
  // 현재 슬라이드들을 가져와서
  let currentSlides = document.querySelectorAll(".slide__li");
  // 그 수를 세어 변수로 저장한다
  let newSlideCount = currentSlides.length;
  // 슬라이드들의 총 넓이 = 각 (슬라이드 너비 + 마진 하나 너비) * 슬라이드 개수 - 마진 하나 너비
  let newWidth =
    (slideWidth + slideMargin) * newSlideCount - slideMargin + "px";
  // ul의 너비를 슬라이드의 총 너비로 할당한다
  slides.style.width = newWidth;
}

//ul의 초기 위치를 구하는 함수
function setInitialPos() {
  // 초기 이동 너비 값을 구한다. 클론하여 붙인 슬라이드 수만큼 곱한다. 왼쪽으로 이동해야하므로 - 를 붙여준다
  let initialTranslateValue = -(slideWidth + slideMargin) * slideCount;
  // ul 에 translateX를 사용해서  초기 이동 너비 값만큼 이동시킨다
  slides.style.transform = `translateX(${initialTranslateValue}px)`;
}

// 다음가기 버튼에 이벤트를 넣어 ul을 이동 시키자
nextBtn.addEventListener("click", function () {
  // ul을 움직이는 moveSlide 함수에 currentIdx +1 을 인자로 넘긴다
  moveSlide(currentIdx + 1);
});

// 이전가기 버튼에 이벤트를 넣어 ul을 이동 시키자
prevBtn.addEventListener("click", function () {
  // ul을 움직이는 moveSlide 함수에 currentIdx -1 을 인자로 넘긴다
  moveSlide(currentIdx - 1);
});

//
function moveSlide(num) {
  // left 값에 -1* 인자 * (슬라이드너비+마진너비) 를 해서 ul의 위치를 바꾼다
  slides.style.left = -num * (slideWidth + slideMargin) + "px";
  // 이동 후에는 currentIdx를 변화된 값(인자)으로 갱신시켜준다
  currentIdx = num;
  // 기본 슬라이드를 지나 클론 슬라이드 도달 후, settimeout 으로 도달 후에야 이동 애니메이션 후에 animated 를 지우고(기존 idx 0 으로 이동 애니메이션이 보이면 안되므로) currentIdx 와 ul의 left 값을 0으로 초기화 시켜서 기존 슬라이드로 이동했으나 다음 슬라이드로 넘어간듯한 효과를 준다
  if (currentIdx === slideCount || currentIdx === -slideCount) {
    setTimeout(() => {
      slides.classList.remove("animated");
      slides.style.left = "0px";
      currentIdx = 0;
    }, 500);
    // 애니메이션을 다시 붙여줘야 하므로 지워진 후여야 하니 settimeout 으로 이전 settimeout 이후 시간으로 animated 클래스를 ul에 다시 추가해준다
    setTimeout(() => {
      slides.classList.add("animated");
    }, 600);
  }
  // 모든 페이저 버튼에 active 클래스를 제거하고, 클릭한 요소만 active를 추가해주자
  for (let i = 0; i < pagerbtns.length; i++) {
    pagerbtns[i].classList.remove("active");
  }
  // 클릭한 이벤트 대상에게 active 클래스를 추가해준다
  pagerbtns[num % slideCount].classList.add("active");
}

// 0번째 페이저 버튼에 active를 추가해주어야 하므로 로드시 0번째로 이동하도록 moveslide를 실행한다
moveSlide(0);

// ul의 부모 영역에 마우스가 들어가면 자동 이동을 멈춘다
slideWrap.addEventListener("mouseover", function () {
  // startAutoslide 함수에서 전역변수로 timer 에 값을 할당했으므로 timer 를 사용 가능하다
  // settimeout 인 timer 를 clearinterval 로 없애준다
  // 위 내용을 stopAutoSlide로 만들어 실행시켰다
  stopAutoSlide();
});

// 마우스가 나가면 자동 이동을 다시 시작한다
slideWrap.addEventListener("mouseout", function () {
  startAutoSlide();
});

// 일정 시간마다 슬라이드 이동하는 함수 만들기
function startAutoSlide() {
  timer = setInterval(function () {
    // 다음 인덱스는 현재 (인덱스%인덱스 수) +1의 값이다
    let nextIdx = (currentIdx % slideCount) + 1;
    // 다음 인덱스를 moveslide 에 넣어 다음 인덱스로 이동한다
    moveSlide(nextIdx);
  }, 1000);
}

// 자동 이동 중지 함수를 만들기
function stopAutoSlide() {
  clearInterval(timer);
}

// 페이지 로드 시 슬라이드 자동 이동 함수를 실행 시킨다
startAutoSlide();

// 페이지네이션으로 슬라이드 이동하기
for (let i = 0; i < pagerbtns.length; i++) {
  // 페이저 버튼마다 클릭 이벤트를 넣어준다
  pagerbtns[i].addEventListener("click", function (event) {
    // 인자로 받은 이벤트의 대상을 event.target 으로 받고, 그 대상의 innerText 로 li의 입력 텍스트를 가져온다
    // 가져온 텍스트를 슬라이드 번호에 맞게 가공하여 변수로 저장한다
    let pagerNum = event.target.innerText - 1;
    // 페이저로 가져온 변수를 moveSlide에 넣어 슬리이드를 이동한다
    moveSlide(pagerNum);
  });
}
