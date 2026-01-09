// 이미지 라이트박스 기능
// 포스트 내 이미지를 클릭하면 원본 크기로 볼 수 있습니다

document.addEventListener('DOMContentLoaded', () => {
  // 라이트박스 HTML 생성
  const lightbox = document.createElement('div');
  lightbox.id = 'image-lightbox';
  lightbox.className = 'image-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <img src="" alt="" class="lightbox-image">
      <button class="lightbox-close" aria-label="닫기">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
  const lightboxImage = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // 포스트 본문의 이미지에만 적용 (썸네일 제외)
  const contentImages = document.querySelectorAll('.prose img');
  
  contentImages.forEach(img => {
    // 이미지를 클릭 가능하게 표시
    img.style.cursor = 'zoom-in';
    img.title = '클릭하여 원본 크기로 보기';
    
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });
  });

  // 라이트박스 열기
  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCaption.textContent = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 라이트박스 닫기
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // 애니메이션 후 이미지 초기화
    setTimeout(() => {
      lightboxImage.src = '';
      lightboxCaption.textContent = '';
    }, 300);
  }

  // 닫기 버튼 클릭
  lightboxClose.addEventListener('click', closeLightbox);

  // 오버레이 클릭
  lightboxOverlay.addEventListener('click', closeLightbox);

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 이미지 클릭 시 닫기 방지 (확대/축소 기능 추가 가능)
  lightboxImage.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});
