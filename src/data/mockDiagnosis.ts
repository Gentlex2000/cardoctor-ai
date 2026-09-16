import type { DiagnosisResult, RepairStep } from '@/types';

/**
 * Mock diagnosis data — simulates the JSON response from an AI API.
 * In production, replace `diagnoseWithAI` with a real API call.
 */

const idleShakeSteps: RepairStep[] = [
  {
    id: 1,
    title: '安全檢查',
    description: '確認車輛停於平坦地面，拉起手煞車，排入 P 檔或 N 檔。等待引擎冷卻至少 15 分鐘後再開始操作。',
    warning: '引擎運轉時請勿將手靠近風扇、皮帶等轉動部件。',
    duration: '5 分鐘',
  },
  {
    id: 2,
    title: '讀取 OBD-II 故障碼',
    description: '將 OBD-II 掃描器插入駕駛座下方 OBD 接頭。開啟掃描器，讀取故障碼。常見相關碼：P0171（混合比過稀）、P0300（隨機失火）。',
    tip: '若無故障碼，問題可能出在引擎腳或節氣門積碳。',
    duration: '10 分鐘',
  },
  {
    id: 3,
    title: '檢查引擎腳',
    description: '目視檢查引擎腳是否有裂痕、橡膠老化或漏油。用手搖晃引擎（熄火狀態），感受是否有異常鬆動。',
    warning: '切勿在引擎運轉時觸摸引擎腳。',
    duration: '15 分鐘',
  },
  {
    id: 4,
    title: '清洗節氣門',
    description: '拆下節氣門上的進氣軟管。使用節氣門清洗劑噴入節氣門內部，以乾淨布擦拭積碳。注意不要讓清洗劑流入感知器。',
    tip: '清洗後可能需要重置 ECU 學習值（拆電瓶負極 10 分鐘）。',
    duration: '30 分鐘',
  },
  {
    id: 5,
    title: '檢查點火系統',
    description: '依序拆下點火線圈及火星塞。檢查火星塞電極間隙（標準 1.1mm）及積碳狀況。必要時更換。',
    warning: '安裝火星塞時請使用扭力扳手，鎖緊扭力約 18-25 Nm。',
    duration: '40 分鐘',
  },
  {
    id: 6,
    title: '測試與驗收',
    description: '組裝完畢後啟動引擎，切換 D 檔，觀察怠速是否平穩。熱車後再次確認。若仍有抖動，建議進廠檢查變速箱或引擎內部。',
    tip: '建議試車 10 分鐘後再次確認怠速狀況。',
    duration: '15 分鐘',
  },
];

export function generateMockDiagnosis(carModel: string, symptom: string): DiagnosisResult {
  const symptomLower = symptom.toLowerCase();

  if (symptomLower.includes('抖') || symptomLower.includes('振') || symptomLower.includes('shake') || symptomLower.includes('idle')) {
    return {
      carModel,
      symptom,
      causes: [
        { id: 'c1', name: '節氣門積碳', probability: 35, description: '節氣門積碳導致怠速空氣量不穩，D 檔怠速時特別明顯。' },
        { id: 'c2', name: '引擎腳老化', probability: 25, description: '引擎腳橡膠老化或裂損，無法吸收引擎震動，傳遞至車身。' },
        { id: 'c3', name: '火星塞老化', probability: 20, description: '火星塞間隙過大或積碳，導致點火不穩定。' },
        { id: 'c4', name: '進氣系統漏氣', probability: 12, description: '進氣管路老化或鬆脫，導致混合比偏稀。' },
        { id: 'c5', name: '噴油嘴堵塞', probability: 8, description: '噴油嘴積碳堵塞，噴油不均。' },
      ],
      diyDifficulty: 3,
      estimatedShopCost: 8000,
      estimatedDiyCost: 2500,
      estimatedSavings: 5500,
      tools: [
        { id: 't1', name: 'OBD-II 掃描器', price: 800, have: false },
        { id: 't2', name: '扭力扳手 (10-60Nm)', price: 1200, have: false },
        { id: 't3', name: '節氣門清洗劑', price: 250, have: false },
        { id: 't4', name: '套筒扳手組 (8-19mm)', price: 1500, have: false },
        { id: 't5', name: '絕緣手套', price: 100, have: false },
      ],
      materials: [
        { id: 'm1', name: '火星塞 (4入)', price: 800, have: false },
        { id: 'm2', name: '節氣門墊片', price: 150, have: false },
        { id: 'm3', name: '化清劑', price: 200, have: false },
      ],
      safetyWarnings: [
        '操作前務必熄火並等待引擎冷卻',
        '勿在密閉空間運轉引擎，避免一氧化碳中毒',
        '拆裝電子元件前先斷開電瓶負極',
        '使用化學清洗劑時保持通風並佩戴手套',
      ],
      steps: idleShakeSteps,
    };
  }

  // Default generic diagnosis
  return {
    carModel,
    symptom,
    causes: [
      { id: 'c1', name: '感知器異常', probability: 30, description: '相關感知器訊號異常或老化，影響引擎控制單元判斷。' },
      { id: 'c2', name: '線路接觸不良', probability: 25, description: '連接器氧化或鬆脫，導致間歇性訊號中斷。' },
      { id: 'c3', name: '油路系統問題', probability: 20, description: '汽油濾芯堵塞或油泵壓力不足。' },
      { id: 'c4', name: '機件磨損', probability: 15, description: '相關機械部件長期使用磨損。' },
      { id: 'c5', name: '其他原因', probability: 10, description: '需進一步檢查才能確認。' },
    ],
    diyDifficulty: 2,
    estimatedShopCost: 5000,
    estimatedDiyCost: 1500,
    estimatedSavings: 3500,
    tools: [
      { id: 't1', name: 'OBD-II 掃描器', price: 800, have: false },
      { id: 't2', name: '套筒扳手組 (8-19mm)', price: 1500, have: false },
      { id: 't3', name: '萬用電表', price: 600, have: false },
      { id: 't4', name: '絕緣手套', price: 100, have: false },
    ],
    materials: [
      { id: 'm1', name: '汽油濾芯', price: 500, have: false },
      { id: 'm2', name: '化清劑', price: 200, have: false },
    ],
    safetyWarnings: [
      '操作前務必熄火並等待引擎冷卻',
      '拆裝電子元件前先斷開電瓶負極',
      '使用化學清洗劑時保持通風並佩戴手套',
    ],
    steps: idleShakeSteps,
  };
}
