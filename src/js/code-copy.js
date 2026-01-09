// 코드 복사 기능
document.addEventListener('DOMContentLoaded', function() {
  // 모든 코드 블록에 복사 버튼 추가
  const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
  
  codeBlocks.forEach((block) => {
    // 이미 버튼이 있으면 스킵
    if (block.parentElement.classList.contains('code-block-wrapper')) {
      return;
    }

    // Wrapper 생성
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    // 언어 라벨 추가
    const language = block.className.match(/language-(\w+)/)?.[1] || 'code';
    const languageLabel = document.createElement('div');
    languageLabel.className = 'code-language';
    languageLabel.textContent = language;
    wrapper.insertBefore(languageLabel, block);

    // 복사 버튼 생성
    const button = document.createElement('button');
    button.className = 'code-copy-button';
    button.innerHTML = `
      <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span class="copy-text">복사</span>
    `;
    
    wrapper.appendChild(button);

    // 복사 기능
    button.addEventListener('click', async () => {
      const code = block.querySelector('code');
      const text = code.textContent;

      try {
        await navigator.clipboard.writeText(text);
        
        // 버튼 상태 변경
        const copyIcon = button.querySelector('.copy-icon');
        const checkIcon = button.querySelector('.check-icon');
        const copyText = button.querySelector('.copy-text');
        
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        copyText.textContent = '복사됨!';
        button.classList.add('copied');

        // 2초 후 원래 상태로
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
          copyText.textContent = '복사';
          button.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('복사 실패:', err);
        alert('복사에 실패했습니다.');
      }
    });
  });
});
