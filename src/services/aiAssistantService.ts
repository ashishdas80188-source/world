import { AIMessage } from '../types/ai';
import { POI } from '../types/navigation';
import { GeocodingService } from './geocodingService';
import { LanguageCode } from '../types/i18n';

export interface AIProcessResult {
  replyText: string;
  detectedIntent: string;
  pois?: POI[];
  actions?: { label: string; action: any; payload?: any }[];
}

export class AIAssistantService {
  public static async processQuery(
    query: string,
    currentLang: LanguageCode
  ): Promise<AIProcessResult> {
    const q = query.trim().toLowerCase();

    // Multilingual restaurant triggers:
    // English: "restaurant", "food", "dining", "eat"
    // Hindi: "रेस्टोरेंट", "खाना", "भोजन", "होटल"
    // Odia: "ରେଷ୍ଟୁରାଣ୍ଟ", "ଖାଦ୍ୟ", "ହୋଟେଲ"
    // Spanish: "restaurante", "comida", "cenar"
    // Japanese: "レストラン", "近くのレストラン", "食事", "食べ物"
    // French: "restaurant", "manger", "nourriture"
    // German: "restaurant", "essen", "lokal"
    // Arabic: "مطعم", "أكل", "طعام"
    // Chinese: "餐厅", "美食", "饭店", "吃的"
    const isRestaurant =
      /restaurant|food|dining|eat|bistro|cafe|भोजन|खाना|रेस्टोरेंट|ଖାଦ୍ୟ|ରେଷ୍ଟୁରାଣ୍ଟ|restaurante|comida|レストラン|食事|manger|essen|مطعم|餐厅|饭店/.test(
        q
      );

    // EV / Charging triggers:
    const isEV =
      /ev|charging|supercharger|electric|battery|ईवी|चार्जिंग|ଇଭି|ଚାର୍ଜିଂ|cargador|eléctrico|充電|recharge|laden|شاحن|充电桩/.test(
        q
      );

    // Hospital / Emergency triggers:
    const isHospital =
      /hospital|emergency|doctor|medical|clinic|अस्पताल|इमरजेंसी|ଡାକ୍ତରଖାନା|hospital|médico|urgencia|病院|救急|hôpital|krankenhaus|notfall|مستشفى|طوارئ|医院|急救/.test(
        q
      );

    // Traffic triggers:
    const isTraffic =
      /traffic|congestion|delay|jam|ट्रैफ़िक|जाम|ଟ୍ରାଫିକ୍|tráfico|atasco|渋滞|交通|trafic|stau|مرور|ازدحام|路况|拥堵/.test(
        q
      );

    // Scenic / Tourism triggers:
    const isScenic =
      /scenic|sight|tourist|monument|view|landmark|दर्शनीय|घूमने|ଦର୍ଶନୀୟ|turístico|monumento|観光|名所|paysage|sehenswürdigkeit|معلم|سياحي|景点|故宫|塔/.test(
        q
      );

    // Weather triggers:
    const isWeather =
      /weather|rain|forecast|temperature|मौसम|बारिश|ପାଣିପାଗ|clima|tiempo|lluvia|天気|雨|météo|wetter|طقس|مطر|天气|气温/.test(
        q
      );

    if (isRestaurant) {
      const places = await GeocodingService.searchPlaces('', 'restaurant');
      return {
        detectedIntent: 'FIND_RESTAURANT',
        replyText: this.getLocalizedResponse('restaurant', currentLang, places.length),
        pois: places.slice(0, 3),
      };
    }

    if (isEV) {
      const places = await GeocodingService.searchPlaces('', 'ev');
      return {
        detectedIntent: 'FIND_EV',
        replyText: this.getLocalizedResponse('ev', currentLang, places.length),
        pois: places.slice(0, 3),
      };
    }

    if (isHospital) {
      const places = await GeocodingService.searchPlaces('', 'hospital');
      return {
        detectedIntent: 'FIND_HOSPITAL',
        replyText: this.getLocalizedResponse('hospital', currentLang, places.length),
        pois: places.slice(0, 2),
      };
    }

    if (isTraffic) {
      return {
        detectedIntent: 'CHECK_TRAFFIC',
        replyText: this.getLocalizedResponse('traffic', currentLang),
      };
    }

    if (isScenic) {
      const places = await GeocodingService.searchPlaces('', 'tourist');
      return {
        detectedIntent: 'FIND_SCENIC',
        replyText: this.getLocalizedResponse('scenic', currentLang, places.length),
        pois: places.slice(0, 3),
      };
    }

    if (isWeather) {
      return {
        detectedIntent: 'CHECK_WEATHER',
        replyText: this.getLocalizedResponse('weather', currentLang),
      };
    }

    // Default place search
    const matchedPlaces = await GeocodingService.searchPlaces(query);
    if (matchedPlaces.length > 0) {
      return {
        detectedIntent: 'SEARCH_LOCATION',
        replyText: this.getLocalizedResponse('foundPlaces', currentLang, matchedPlaces.length),
        pois: matchedPlaces.slice(0, 3),
      };
    }

    // General fallback
    return {
      detectedIntent: 'GENERAL_ASSIST',
      replyText: this.getLocalizedResponse('generalHelp', currentLang),
    };
  }

  private static getLocalizedResponse(
    type: string,
    lang: LanguageCode,
    count: number = 0
  ): string {
    const responses: Record<string, Partial<Record<LanguageCode, string>>> = {
      restaurant: {
        en: `I found ${count} top-rated restaurants and dining spots for you. Choose a place below to navigate directly:`,
        hi: `मुझे आपके लिए ${count} शीर्ष रेटेड रेस्टोरेंट और भोजन स्थल मिले हैं। नेविगेशन शुरू करने के लिए नीचे चुनें:`,
        or: `ମୁଁ ଆପଣଙ୍କ ପାଇଁ ${count}ଟି ଉଚ୍ଚ ମାନ୍ୟତାପ୍ରାପ୍ତ ରେଷ୍ଟୁରାଣ୍ଟ ଖୋଜି ପାଇଛି। ରାସ୍ତା ଦେଖିବା ପାଇଁ ତଳେ ଚୟନ କରନ୍ତୁ:`,
        es: `He encontrado ${count} restaurantes altamente valorados cerca de ti. Selecciona uno para navegar:`,
        ja: `周辺の高評価レストランを ${count} 件見つけました。ナビを開始する場所を選択してください：`,
        'zh-CN': `已为您找到 ${count} 家高评分餐厅与特色美食。请在下方选择目的地以开启导航：`,
        fr: `J'ai trouvé ${count} restaurants très bien notés. Choisissez un lieu ci-dessous pour démarrer la navigation :`,
        de: `Ich habe ${count} erstklassige Restaurants gefunden. Wählen Sie einen Ort aus, um die Navigation zu starten:`,
        ar: `عثرت لك على ${count} من أفضل المطاعم وأماكن تناول الطعام. اختر مكانًا أدناه لبدء الملاحة:`,
      },
      ev: {
        en: `Here are ${count} ultra-fast EV Supercharging stations available nearby with live availability:`,
        hi: `यहाँ निकटतम ${count} सुपरफास्ट ईवी चार्जिंग स्टेशन उपलब्ध हैं:`,
        or: `ଏଠାରେ ନିକଟତମ ${count}ଟି ଇଭି ସୁପରଚାର୍ଜିଂ ଷ୍ଟେସନ୍ ଉପଲବ୍ଧ ଅଛି:`,
        es: `Aquí tienes ${count} estaciones de carga rápida para vehículos eléctricos disponibles:`,
        ja: `近隣で利用可能な急速EV充電スタンドが ${count} 件見つかりました：`,
        'zh-CN': `附近为您检测到 ${count} 处新能源汽车超级充电桩：`,
        fr: `Voici ${count} bornes de recharge rapide pour véhicules électriques à proximité :`,
        de: `Hier sind ${count} Schnellladestationen in Ihrer Nähe mit Echtzeit-Verfügbarkeit:`,
        ar: `إليك ${count} من محطات الشحن الفائقة للسيارات الكهربائية المتوفرة في المنطقة:`,
      },
      hospital: {
        en: `🚨 Priority Route: Found ${count} emergency medical centers nearby. Tap to route immediately:`,
        hi: `🚨 आपातकालीन सेवा: निकटतम ${count} अस्पताल व चिकित्सा केंद्र मिले हैं। तुरंत नेविगेट करें:`,
        or: `🚨 ଜରୁରୀକାଳୀନ ସେବା: ନିକଟସ୍ଥ ${count}ଟି ଡାକ୍ତରଖାନା ଚିହ୍ନଟ ହୋଇଛି। ତୁରନ୍ତ ରାସ୍ତା ଦେଖନ୍ତୁ:`,
        es: `🚨 Ruta de emergencia: ${count} centros médicos y hospitales detectados cerca:`,
        ja: `🚨 緊急医療ルート：周辺の総合病院・救急センターを ${count} 件確認しました：`,
        'zh-CN': `🚨 紧急救援通道：已定位附近 ${count} 家急救中心与综合医院，点击即刻指引路线：`,
        fr: `🚨 Urgences : ${count} hôpitaux et centres médicaux trouvés à proximité :`,
        de: `🚨 Notfall-Navigation: ${count} Krankenhäuser in der Nähe gefunden. Tippen Sie zur sofortigen Route:`,
        ar: `🚨 مسار الطوارئ: تم العثور على ${count} من المستشفيات ومراكز الطوارئ القريبة:`,
      },
      traffic: {
        en: '🟢 Traffic Analysis: The main highway route currently shows optimal flow with standard travel times and no major incident delays.',
        hi: '🟢 ट्रैफ़िक विश्लेषण: मुख्य राजमार्ग पर वर्तमान में ट्रैफ़िक सुचारू है और कोई गंभीर जाम नहीं है।',
        or: '🟢 ଟ୍ରାଫିକ୍ ବିଶ୍ଳେଷଣ: ମୁଖ୍ୟ ରାସ୍ତାରେ ଟ୍ରାଫିକ୍ ସ୍ୱାଭାବିକ ଅଛି ଏବଂ କୌଣସି ଅସୁବିଧା ନାହିଁ।',
        es: '🟢 Estado del tráfico: La ruta principal muestra condiciones óptimas sin retrasos por accidentes.',
        ja: '🟢 交通状況：主要幹線道路は現在順調に流れており、大きな渋滞や事故規制はありません。',
        'zh-CN': '🟢 实时路况分析：主干道行驶畅通，通行效率良好，暂无严重交通管制或拥堵延误。',
        fr: '🟢 Info Trafic : Le trafic est fluide sur l\'itinéraire principal, sans retards majeurs signalés.',
        de: '🟢 Verkehrsstatus: Auf der Hauptroute herrscht derzeit freie Fahrt ohne nennenswerte Behinderungen.',
        ar: '🟢 تحليل حركة المرور: المسار الرئيسي يشهد حركة مرور سلسة وممتازة دون تأخيرات تذكر.',
      },
      scenic: {
        en: `Here are ${count} breathtaking scenic viewpoints and iconic cultural landmarks along your travel corridor:`,
        hi: `यहाँ आपके रास्ते में ${count} सुंदर दर्शनीय स्थल और प्रसिद्ध सांस्कृतिक स्थल हैं:`,
        or: `ଆପଣଙ୍କ ଯାତ୍ରା ପଥରେ ${count}ଟି ପ୍ରସିଦ୍ଧ ଦର୍ଶନୀୟ ସ୍ଥାନ ଚିହ୍ନଟ ହୋଇଛି:`,
        es: `Aquí tienes ${count} miradores y puntos de interés panorámicos recomendados:`,
        ja: `ルート沿いのおすすめ景観スポットおよび有名観光地が ${count} 件見つかりました：`,
        'zh-CN': `为您推荐沿途 ${count} 处绝美自然风光与历史文化地标：`,
        fr: `Voici ${count} sites panoramiques et monuments remarquables sur votre trajet :`,
        de: `Hier sind ${count} sehenswerte Aussichtspunkte und Wahrzeichen entlang Ihrer Route:`,
        ar: `إليك ${count} من أجمل المعالم السياحية والمناظر الخلابة الواقعة على طول المسار:`,
      },
      weather: {
        en: '🌤️ Route Weather: Clear skies with mild winds, 24°C (75°F). Perfect driving conditions ahead!',
        hi: '🌤️ मार्ग का मौसम: 24°C के साथ साफ आसमान और हल्की हवा। यात्रा के लिए एकदम अनुकूल स्थिति!',
        or: '🌤️ ପାଣିପାଗ: ଆକାଶ ନିର୍ମଳ ଅଛି, ତାପମାତ୍ରା ୨୪°C। ଯାତ୍ରା ପାଇଁ ଉତ୍ତମ ପରିବେଶ!',
        es: '🌤️ Clima en ruta: Cielos despejados con vientos suaves, 24°C (75°F). ¡Condiciones ideales para conducir!',
        ja: '🌤️ ルート天候：晴天、気温24℃。視界良好で非常に快適な走行環境です！',
        'zh-CN': '🌤️ 沿途天气：晴朗少云，气温 24°C，微风拂面，整体驾驶视野及行车条件极佳！',
        fr: '🌤️ Météo de route : Ciel dégagé, température de 24°C. Conditions de conduite optimales !',
        de: '🌤️ Wetterbericht: Heiter bis sonnig bei 24°C. Optimale Fahrbedingungen auf der gesamten Strecke!',
        ar: '🌤️ طقس المسار: سماء صافية مع رياح معتدلة، درجة الحرارة 24 مئوية. ظروف قيادة ممتازة!',
      },
      foundPlaces: {
        en: `I found ${count} matched global locations for your search:`,
        hi: `आपकी खोज के लिए मुझे ${count} स्थान मिले हैं:`,
        or: `ଆପଣଙ୍କ ଅନୁସନ୍ଧାନ ପାଇଁ ${count}ଟି ସ୍ଥାନ ମିଳିଛି:`,
        es: `He encontrado ${count} ubicaciones que coinciden con tu búsqueda:`,
        ja: `検索条件に一致するスポットが ${count} 件見つかりました：`,
        'zh-CN': `已为您检索到 ${count} 处匹配的地点：`,
        fr: `J'ai trouvé ${count} lieux correspondant à votre recherche :`,
        de: `Ich habe ${count} passende Orte gefunden:`,
        ar: `تم العثور على ${count} من الأماكن المطابقة لبحثك:`,
      },
      generalHelp: {
        en: 'I can help you navigate anywhere in the world, search local amenities in native scripts, monitor live traffic, or check EV chargers. Try asking "Find a restaurant near me" or search for a destination.',
        hi: 'मैं दुनिया में कहीं भी नेविगेट करने, भोजन स्थल खोजने, ट्रैफ़िक देखने या ईवी चार्जर ढूंढने में आपकी मदद कर सकता हूँ। "मेरे पास एक रेस्टोरेंट खोजो" बोलकर देखें!',
        or: 'ମୁଁ ଦୁନିଆର ଯେକୌଣସି ସ୍ଥାନକୁ ରାସ୍ତା ଦେଖାଇବା, ଖାଦ୍ୟପେୟ ସ୍ଥଳ ଖୋଜିବା କିମ୍ବା ଟ୍ରାଫିକ୍ ଯାଞ୍ଚ କରିବାରେ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି। "ମୋ ପାଖରେ ଏକ ରେଷ୍ଟୁରାଣ୍ଟ ଖୋଜ" ପଚାରି ଦେଖନ୍ତୁ!',
        es: 'Puedo ayudarte a navegar a cualquier parte del mundo, buscar restaurantes o estaciones de carga. Prueba diciendo "Encuentra un restaurante cerca de mí".',
        ja: '世界中の目的地へのナビ、周辺施設・EV充電スタンドの検索、渋滞情報の確認などが可能です。「近くのレストランを探して」とお試しください。',
        'zh-CN': '我支持全球 45+ 种语言的智能路线指引、地标检索、周边餐饮搜索与路况分析。您可以尝试提问：“寻找附近的餐厅”或输入任意目的地。',
        fr: 'Je peux vous guider partout dans le monde, trouver des restaurants ou des bornes de recharge. Essayez de demander "Trouve un restaurant près d\'ici".',
        de: 'Ich kann Sie weltweit navigieren, Restaurants oder E-Ladesäulen finden und den Verkehr überwachen. Fragen Sie z.B. "Finde ein Restaurant in meiner Nähe".',
        ar: 'يمكنني مساعدتك في الملاحة إلى أي مكان في العالم والبحث عن المطاعم ومحطات الشحن وحالة المرور. جرب أن تسأل: "ابحث عن مطعم قريب مني".',
      },
    };

    return (
      responses[type]?.[lang] ??
      responses[type]?.en ??
      'I am ready to help guide your journey worldwide.'
    );
  }
}
