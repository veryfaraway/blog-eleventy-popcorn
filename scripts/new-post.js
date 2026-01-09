#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function createPost() {
  console.log('📝 새 포스트 생성\n');

  const title = await question('제목: ');
  const description = await question('설명: ');
  const category = await question('카테고리 (예: Frontend, Backend, DevTools): ');
  const tags = await question('태그 (쉼표로 구분): ');

  const year = new Date().getFullYear();
  const date = new Date().toISOString().split('T')[0];
  const slug = slugify(title);
  
  const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
  const tagsYaml = tagsArray.map(tag => `  - ${tag}`).join('\n');

  const template = `---
layout: post.njk
title: ${title}
description: ${description}
date: ${date}
category: ${category}
tags:
${tagsYaml}
---

# ${title}

여기에 내용을 작성하세요.

## 섹션 1

내용...

## 섹션 2

내용...

## 마치며

마무리 내용...
`;

  const dirPath = path.join(__dirname, '..', 'src', 'posts', year.toString());
  const filePath = path.join(dirPath, `${slug}.md`);

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // 파일이 이미 존재하는지 확인
  if (fs.existsSync(filePath)) {
    console.log(`\n❌ 파일이 이미 존재합니다: ${filePath}`);
    rl.close();
    return;
  }

  fs.writeFileSync(filePath, template, 'utf8');
  
  console.log(`\n✅ 포스트가 생성되었습니다!`);
  console.log(`📁 경로: ${filePath}`);
  console.log(`🔗 슬러그: ${slug}`);
  
  rl.close();
}

createPost().catch(error => {
  console.error('오류 발생:', error);
  rl.close();
  process.exit(1);
});
