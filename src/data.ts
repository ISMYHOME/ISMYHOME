/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQItem, InspectionItem, CaseStudy, HeroSlide } from './types';

// Asset imports
import heroApartment from '/src/assets/images/hero_apartment_1780202019422.png';
import thermalScan from '/src/assets/images/thermal_scan_1780202033964.png';
import laserScan from '/src/assets/images/laser_scan_1780202049852.png';
import tileDefect from '/src/assets/images/tile_defect_1780202067595.png';
import windowDefect from '/src/assets/images/window_defect_1780202084296.png';

// Authentic user-uploaded case images
import laserScanNew from '/src/assets/images/laser_scan_new_1780205155922.png';
import woodFloorMarkers from '/src/assets/images/wood_floor_markers_1780205174085.png';
import tileTappingCheck from '/src/assets/images/tile_tapping_check_1780205193166.png';
import windowForestView from '/src/assets/images/window_forest_view_1780205212378.png';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    title: '신축 아파트 전경',
    subtitle: '시공 현장 경험이 있는 베테랑 건축공학 전문가가 입주민의 꼼꼼한 눈과 귀가 되어 소중한 내 집을 철저하게 진단합니다.',
    imageUrl: heroApartment,
    badge: '건축공학 전공 및 시공사 경력'
  },
  {
    id: 'hero-2',
    title: '열화상카메라 점검',
    subtitle: '눈에 보이지 않는 벽체 내부의 단열재 누락, 미세 누수, 결로 취약 구역을 열화상 정밀 진단 장비로 명확하게 잡아냅니다.',
    imageUrl: thermalScan,
    badge: '정밀 열센서 검측 장비 원리'
  },
  {
    id: 'hero-3',
    title: '레이저레벨 수평 측정',
    subtitle: '미세한 기울어짐이나 벽체 수직 불량 및 바닥 단차까지, 디지털 전문 측정 장비인 레이저 레벨기로 빈틈없이 오차 범위를 계측합니다.',
    imageUrl: laserScan,
    badge: '고정밀 레이저 계측 시스템'
  }
];

export const USP_ITEMS = [
  {
    id: 'usp-1',
    title: '시공을 아는 전문가의 점검',
    description: '단순한 육안 확인이 아닙니다. 건축공학 전공 및 국내 일류 시공 현장 관리 경험을 바탕으로, 아파트 시공법의 원리에 입각하여 미래 하자 발생 가능성까지 완벽 설계 분석 점검합니다.',
    tag: '건축공학 전문성',
    detailText: '팀장 전체 건축공학 전공 및 시공사 출신'
  },
  {
    id: 'usp-2',
    title: '전문 정밀 장비 사용',
    description: '적외선 열화상 카메라, 디지털 레이저 레벨기, 타일 탐지봉, 타진봉 등 시공사 현업 수준의 과학 진단 도구를 100% 가동하여 진단합니다.',
    tag: '첨단 검구 활용',
    detailText: '레이저레벨기, 열화상카메라, 타진봉, 고무망치, 대기질 측정기 및 라돈 측정기'
  },
  {
    id: 'usp-3',
    title: '입주민 중심 친절 서비스',
    description: '이해하기 힘든 건설 기술 표준어 대신 알기 쉬운 눈높이 설명을 제공합니다. 건설 대기업 하자 보수 청구 양식에 맞춘 리포트를 즉시 정리하여 시공사에 확실히 요구할 수 있도록 밀착 가이드합니다.',
    tag: '하자보수 서포트',
    detailText: '남녀노소 나이 불문 이해하기 쉬운 눈높이 설명으로 내 집의 하자를 직접 확인하세요'
  }
];

export const PROCESS_STEPS = [
  {
    step: '01',
    title: '접수 및 예약 확정',
    description: '카카오톡으로 평수, 방문 일정, 희망 날짜를 기입하여 일정을 확인받습니다.'
  },
  {
    step: '02',
    title: '현장 베테랑 팀 배정',
    description: '건축공학 자격 및 시공 관리 경력을 완비한 전문 팀장이 전담 매칭되어 세밀하게 실무 준비를 구축합니다.'
  },
  {
    step: '03',
    title: '방문 전 안심 통화',
    description: '확정된 사전점검일 1~2일 전, 유선상으로 최종 방문 시간, 입주자 준비물, 주요 점검 유의 사항을 친절히 안내합니다.'
  },
  {
    step: '04',
    title: '세대 정밀 정형 점검',
    description: '약 1시간 ~ 1시간 30 분 동안 배정팀이 투입되어 육안과 다각도 첨단 측정 검사 장비를 연동해 아파트 전체 하자를 입체 탐색합니다.'
  },
  {
    step: '05',
    title: '동반 브리핑 및 조언 안내',
    description: '현장에서 입주자분께 발견된 하자를 위치별, 중요도별로 일대일 현장 상세 리드하며, 향후 시공사 보수 신청 프로세스 대응법을 가이드해 드립니다.'
  }
];

export const VISUAL_ITEMS: InspectionItem[] = [
  { id: 'v-1', title: '벽지 오염 및 마감 상태', description: '도배 풀 자국, 몰딩 틈새 들뜸, 천장 및 모서리 오염 및 이음매 마감 상태 정밀 점검' },
  { id: 'v-2', title: '바닥재 찍힘 및 스크래치', description: '거실, 안방, 주방 강마루 표면 찍힘, 걸레받이 벌어짐, 긁힘 자국 스티커 표기 분별' },
  { id: 'v-3', title: '타일 깨짐 및 줄눈 밀착도', description: '욕실, 베란다 정밀 타일 시각 점검 및 백시멘트 충전 누락 상태 수색' },
  { id: 'v-4', title: '창호 흔들림 및 문틀 고정', description: '문짝 수평 조율 및 도어록 잠금장치 시공 불량, 창문 문틈 유격 및 도랑 마감 확인' },
  { id: 'v-5', title: '가구 및 빌트인 수납장', description: '붙박이장, 신발장 문짝 수평 단차 및 내부 나사 고정 상태, 찍힘 및 내부 마감 불량 검측' },
  { id: 'v-6', title: '벽/가구 실리콘 마감 무늬', description: '젠다이, 주방 상판, 욕조 가두리 실리콘 탈리 현상 및 곰팡이 방지 처리 누락 집중 체크' },
  { id: 'v-7', title: '천장 몰딩 및 걸레받이', description: '액자 레일 구역, 몰딩 못 박힘 튀어나옴 현상, 도배 이음 불량 및 탈락 흔적 추적' }
];

export const TOOL_ITEMS: InspectionItem[] = [
  { id: 't-1', title: '타일/벽체 내부 들뜸 검사', description: '진공 고무망치 및 타일 탐지봉 타격을 통해 벽체 및 바닥 타일 속 빈 공간 울림음 감지' },
  { id: 't-2', title: '마루 들뜸 및 본드 결합도', description: '마루를 밟을 때 들썩이거나 뻑뻑 소리가 나는 접착제 도포 누락 영역 계측 탈착 검정' },
  { id: 't-3', title: '창호 매끄러운 수동 개폐', description: '슬라이딩 시스템 창문 개폐 저항성 점검 및 외풍 유입 유격 오차 테스트' },
  { id: 't-4', title: '부엌/체임버 배수 경사도', description: '욕실 및 실외기실 배수 트렌치 방향 물빠짐 구배 및 물 고임 상태 리필 테스트' },
  { id: 't-5', title: '도어/수납 수평 기능 체크', description: '가구 문틀 수동 개폐 시 스스로 다시 열리거나 쏠리는 중력 유격 상태 수공 테스트' }
];

export const EQUIPMENT_ITEMS: InspectionItem[] = [
  { id: 'e-1', title: '레이저 수평계 바닥 수평', description: '정밀 수광기 일체형 레벨기로 각 객실 모서리/중앙 표고차를 수치화하여 기울어짐 계측' },
  { id: 'e-2', title: '레이저 수직도 벽체 계측', description: '기둥 모서리 및 문틀 몰딩 수직 부합률을 측정하여 전도 허용 오차 이탈 여부 진단' },
  { id: 'e-3', title: '열화상 카메라 단열재 상태', description: '적외선 카메라를 통해 발코니 확장부, 샤시 하부 충전 불량 및 외벽 결로 생성 취약 구간 탐상' },
  { id: 'e-4', title: '열화상 난방 배관 누수 파악', description: '바닥 보일러 난방 온수관의 균일 순환도 및 미세 크랙 누수 정형 패턴을 적외선 가스화 확인' }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: '수직수평 불량',
    subtitle: '3D 멀티 레이저 레벨 정밀 계측',
    imageUrl: laserScanNew,
    zoomImageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfNTYg/MDAxNzgwNjc2MTcyNjY3.LlYV2yL2guw6uGHJn9f8BO3iNeodPbdgWCd4TfEEYPsg.D1gWS1tPNR_XHku8b0n8vwprvOlaT0HGy64ieGhj6wcg.JPEG/20260530_104728.jpg?type=w773',
    description: '거실 및 주방 가구, 문틀의 수직수평 왜곡을 3D 공학 레이저 레벨 장비로 계측한 사례입니다. 허용 오차 한계를 초과하여 일탈도가 심화된 벽체와 수평선 불균형 상태를 선연하게 포착하였습니다.',
    defectType: '수직수평 불량',
    impactScore: 5,
    inspectorNote: '벽면 및 가구 수직 왜곡 현상을 기하학적 수광 장비 수치로 정밀 기록하였으며, 마감재 비틀림 해결을 위한 창틀 전면 가이드 보정 및 수평 재시공을 청구 완료했습니다.'
  },
  {
    id: 'case-2',
    title: '마루들뜸',
    subtitle: '바닥 마감 강마루 접착 밀착도 진단',
    imageUrl: woodFloorMarkers,
    zoomImageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMTU0/MDAxNzgwNjc2MTcyNjYy.1kbkhEiAbGcWdHBESDhiU48SgXX4hnGdWZ_LbxYOerAg.nMguiJHpJBfOqZlSZrMR7kECSlB7HPOo7XJAFufqm2gg.JPEG/scaled_8d952a9c-784c-45fa-88f3-0291f18e5dab7860552518623316392.jpg?type=w773',
    description: '침실 및 거실 바닥 강마루 시공 시 접착제 도포가 고르지 못해 마루판이 콘크리트 슬래브로부터 대거 박리되어 들뜨는 현상을 표출하였습니다. 보행 시 찌걱거리는 이음 소음과 삐걱거리는 유격 거동이 심하게 전달되는 상태입니다.',
    defectType: '마루들뜸',
    impactScore: 4,
    inspectorNote: '미세 정밀 공음 타격을 통한 비파괴 밀착 판정과 보행 하중 시의 흔들림을 파악하였고, 들뜬 범위 전체에 환경 무해 완충 인젝션 충진 주입 보강을 청구했습니다.'
  },
  {
    id: 'case-3',
    title: '타일 들뜸',
    subtitle: '욕실 벽면 타격봉 공음 진단 및 밀착도 검사',
    imageUrl: tileTappingCheck,
    zoomImageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMzkg/MDAxNzgwNjc2MTcyNzIw.gfMyt6C6TahvkDOuBrXeef5jMkuxEuPWfsZBb552RZUg.t8lIKt1yiV1c0UwO44uwrVImk70esRVyLbF-w36EOoAg.JPEG/20260530_110512.jpg?type=w773',
    description: '부부 욕실 벽면의 대형 타일 후면에 붙이는 접착 모르타르가 한 면에 밀착 충진되지 않고 들떠, 타격봉 고음 계측 시 텅 비어 있는 공음이 다발하여 적출하였습니다. 건조 수축 및 외부 진동 누적 시 타일 전체가 전도되어 전면 붕괴 및 낙하 인명사고를 야기할 수 있는 심각한 위험군입니다.',
    defectType: '타일 들뜸',
    impactScore: 5,
    inspectorNote: '벽면 전도 위험도 및 이탈 변위의 심각성을 전달하였으며, 단순 실리콘 처리를 배제하고 시공사에 불량 타일의 즉각적인 탈거 및 배면 에폭시 충진식의 확실한 재공정 수립을 관철 완료하였습니다.'
  },
  {
    id: 'case-4',
    title: 'PCV 창호 창틀 고정 불량',
    subtitle: '외창 기밀성 및 프레임 결속 고정 상태 정밀 측정',
    imageUrl: windowForestView,
    zoomImageUrl: 'https://postfiles.pstatic.net/MjAyNjA2MDZfMjU0/MDAxNzgwNjc2MTcyNjYy.m6wYIhzynisEgk0R_JojB0jf9e9KrrKVpPoo3Wmnhvgg.b7wsAOORt4sy-23IRfJAhSA_uz-EXSrl-MHw2bqks2kg.JPEG/scaled_fb645958-3f33-4dd8-a26a-6c6498d1c6061995037400052716866.jpg?type=w773',
    description: '외부 PVC(PCV) 창고 및 프레임의 고정 결속 나비 나사 및 칼블럭 체결 개수가 매뉴얼 규정 대비 부족하여, 강풍 하중 시 시공 유격 흔들림 및 틈새 바람 유입이 가중되는 상태입니다. 실리콘 방수 코킹 선상에도 균열 리스크를 동반하고 있습니다.',
    defectType: 'PCV 창호 창틀 고정 불량',
    impactScore: 4,
    inspectorNote: '창호 처짐 및 수압 기밀 지표 저하 압력을 실측하여 누수 방조 증빙 리포트에 연동하였으며, 창틀 내부 밀실 앵커 추가 보강 결속 및 단열 기밀 코킹 전면 공정 보완을 청구 완료했습니다.'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '아파트 사전점검 시간은 보통 얼마나 걸리나요?',
    answer: '평형이나 구조, 발견되는 하자의 개수에 따라 미세한 차이가 있으나 보통 전담 팀장이 세대 방문하여 1시간에서 최대 1시간 30분 동안 한 시도 쉬지 않고 매우 철저하게 점검을 진행합니다.'
  },
  {
    id: 'faq-2',
    question: '사전점검 시 입주민인 제가 처음부터 끝까지 같이 상주해야 하나요?',
    answer: '시작하실 때 간단한 특이사항 인계받고 귀가하셔도 전혀 무방합니다. 최고의 효율을 위해 세밀 점검 작업은 전담팀 단독으로 치밀하게 진행된 후, 종료 전 20~30분 전에 내방하셔서 장비 계측 수치와 하자 상세 내용을 합동 현장 브리핑 받으시는 것을 적극적으로 권장해 드립니다.'
  },
  {
    id: 'faq-3',
    question: '점검 후 집안 하자를 발견하면 보수 시비는 어떻게 진행되나요?',
    answer: 'IS마이홈은 단순 검진만이 아니라, 시공사 모바일 접수 앱 이미지 업로드용 현장 표기 스티커 접사 표준본을 현장에서 즉시 시공사 측으로 전송하여 입주민분들이 따로 작업하셔야되는것은 없습니다.'
  },
  {
    id: 'faq-4',
    question: '입주민이 아파트 사전점검 당일에 준비해야 할 필수 물품이 있나요?',
    answer: '입주예정자임을 증명할 수 있는 신분증과 아파트 임시 출입 패스 이외에는 별도로 챙기셔야 할 도구가 절대 없습니다. 사다리, 마스크, 장갑, 스크래치 점검지, 스티커 테이프 및 수만 원 대 전문 장비 일체는 저희 IS마이홈 전문 점검팀이 완비하여 현장에 전격 출동합니다.'
  }
];

export const COMPANY_STATS = [
  { value: '건축공학 전문', label: '전원 전공자 보유' },
  { value: '100+', label: '누적 사전점검 아파트' },
  { value: '98.7%', label: '고객 신뢰 만족 평점' },
  { value: '1:1 매칭', label: '책임 기술 팀장 배치' }
];
