# AIMES | AI-based Manufacturing Execution System

AIMES는 AI/ML 기반의 예측적 품질관리, 실시간 공정 최적화, 자율적 의사결정을 구현하는 차세대 제조실행시스템(MES) 소개 웹페이지입니다.

> **A3 Security Co., Ltd. — A3-AI Working Group**

## Overview

대한민국 식품제조 중견/중소기업의 AX(AI Transformation) 전환을 위한 표준 플랫폼을 목표로 하며, 이 저장소는 AIMES 시스템의 아키텍처와 핵심 기능을 소개하는 정적 웹사이트입니다.

### 주요 콘텐츠

- **8계층 시스템 아키텍처** — ISA-95 표준 준거, Purdue Model 기반 OT/IT 분리
- **핵심 모듈** — 9개 마이크로서비스, 143개 API 엔드포인트
- **AI/ML 파이프라인** — 6개 AI/ML 모델 (품질 예측, 공정 최적화 등)
- **워크플로우** — 실시간 공정 모니터링 및 자율 의사결정
- **ROI 분석** — 도입 효과 및 투자 대비 수익
- **로드맵** — 단계별 구축 계획

## Tech Stack

| 구분 | 기술 |
|------|------|
| Markup | HTML5 |
| Styling | CSS3, Bootstrap 5.3 |
| Script | Vanilla JavaScript |
| Icons | Bootstrap Icons |
| Fonts | Outfit, Inter (Google Fonts) |

## Project Structure

```
├── index.html   # 메인 페이지 (한/영 다국어 지원)
├── style.css    # 커스텀 스타일시트
├── script.js    # 인터랙션, 애니메이션, 다국어 처리
└── README.md
```

## Features

- 반응형 디자인 (모바일/태블릿/데스크톱)
- 한국어/영어 다국어 전환
- 3D 배경 애니메이션
- Glass-morphism UI
- 카드 클릭 시 모달 팝업 상세 정보
- 스크롤 기반 fade-in 애니메이션
- 숫자 카운트업 통계

## Getting Started

별도 빌드 과정 없이 `index.html`을 브라우저에서 열면 바로 확인할 수 있습니다.

```bash
# 로컬에서 열기
open index.html
# 또는
xdg-open index.html
```

## License

This project is proprietary to A3 Security Co., Ltd.
