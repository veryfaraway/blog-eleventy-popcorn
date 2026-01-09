// 외부 링크 자동 처리
document.addEventListener('DOMContentLoaded', function() {
  // prose 영역 내의 모든 링크 찾기
  const contentLinks = document.querySelectorAll('.prose a');
  
  contentLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // 외부 링크 판별 (http/https로 시작하고 현재 도메인이 아닌 경우)
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      const currentDomain = window.location.hostname;
      const linkDomain = new URL(href).hostname;
      
      // 외부 도메인이면 새 탭으로 열기
      if (linkDomain !== currentDomain) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // 외부 링크 아이콘 추가 (선택사항)
        if (!link.querySelector('.external-link-icon')) {
          const icon = document.createElement('span');
          icon.className = 'external-link-icon';
          icon.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>';
          link.appendChild(icon);
        }
      }
    }
  });
});
