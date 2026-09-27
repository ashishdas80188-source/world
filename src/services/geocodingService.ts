import { POI } from '../types/navigation';

export const GLOBAL_POI_DATABASE: POI[] = [
  // Japan
  {
    id: 'poi-tokyo-station',
    name: 'Tokyo Station',
    nativeNames: { ja: '東京駅', 'zh-CN': '东京站', ko: '도쿄역' },
    category: 'transit',
    lat: 35.681236,
    lng: 139.767125,
    address: '1 Chome Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    rating: 4.8,
    reviewsCount: 32400,
    tags: ['shinkansen', 'transit', 'tokyo', 'station', '東京駅'],
    phone: '+81 50-2016-1600',
  },
  {
    id: 'poi-shibuya-crossing',
    name: 'Shibuya Crossing & Dining',
    nativeNames: { ja: '渋谷スクランブル交差点', 'zh-CN': '涩谷十字路口' },
    category: 'restaurant',
    lat: 35.659482,
    lng: 139.700553,
    address: '2 Chome Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
    rating: 4.7,
    reviewsCount: 48900,
    priceLevel: 2,
    openNow: true,
    tags: ['restaurant', 'food', 'shibuya', 'sushi', 'ramen', 'レストラン'],
  },

  // France
  {
    id: 'poi-eiffel-tower',
    name: 'Eiffel Tower',
    nativeNames: { fr: 'Tour Eiffel', es: 'Torre Eiffel', ar: 'برج إيفل', hi: 'एफिल टॉवर' },
    category: 'tourist',
    lat: 48.85837,
    lng: 2.294481,
    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France',
    rating: 4.9,
    reviewsCount: 95000,
    tags: ['monument', 'paris', 'tourist', 'tour eiffel', 'tower'],
  },
  {
    id: 'poi-le-bistro-paris',
    name: 'Le Grand Véfour Bistro',
    nativeNames: { fr: 'Le Grand Véfour Bistro', es: 'Bistró Le Grand Véfour' },
    category: 'restaurant',
    lat: 48.8661,
    lng: 2.3384,
    address: '17 Rue de Beaujolais, 75001 Paris, France',
    rating: 4.9,
    reviewsCount: 4200,
    priceLevel: 4,
    openNow: true,
    tags: ['restaurant', 'dining', 'michelin', 'french bistro', 'food'],
  },

  // India
  {
    id: 'poi-india-gate',
    name: 'India Gate & Central Vista',
    nativeNames: { hi: 'इण्डिया गेट', or: 'ଇଣ୍ଡିଆ ଗେଟ୍', pa: 'ਇੰਡੀਆ ਗੇਟ', bn: 'ইন্ডিয়া গেট' },
    category: 'tourist',
    lat: 28.612912,
    lng: 77.22951,
    address: 'Rajpath, India Gate, New Delhi, Delhi 110001, India',
    rating: 4.8,
    reviewsCount: 78000,
    tags: ['delhi', 'monument', 'tourist', 'इण्डिया गेट', 'india gate'],
  },
  {
    id: 'poi-jagannath-temple',
    name: 'Shree Jagannatha Temple, Puri',
    nativeNames: { or: 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ପୁରୀ', hi: 'श्री जगन्नाथ मंदिर पुरी', bn: 'শ্রী জগন্নাথ মন্দির' },
    category: 'tourist',
    lat: 19.804866,
    lng: 85.817887,
    address: 'Grand Road, Puri, Odisha 752001, India',
    rating: 4.9,
    reviewsCount: 54000,
    tags: ['puri', 'odisha', 'temple', 'ଜଗନ୍ନାଥ', 'heritage'],
  },
  {
    id: 'poi-bukhara-restaurant',
    name: 'Bukhara Grand Restaurant',
    nativeNames: { hi: 'बुखारा रेस्टोरेंट', or: 'ବୁଖାରା ରେଷ୍ଟୁରାଣ୍ଟ' },
    category: 'restaurant',
    lat: 28.5972,
    lng: 77.1738,
    address: 'ITC Maurya, Sardar Patel Marg, Diplomatic Enclave, New Delhi, 110021',
    rating: 4.8,
    reviewsCount: 12500,
    priceLevel: 3,
    openNow: true,
    tags: ['restaurant', 'food', 'dal bukhara', 'रेस्टोरेंट', 'ରେଷ୍ଟୁରାଣ୍ଟ', 'dining'],
  },
  {
    id: 'poi-aiims-hospital',
    name: 'AIIMS Super Speciality Hospital',
    nativeNames: { hi: 'एम्स सुपर स्पेशियलिटी अस्पताल', or: 'ଏମ୍ସ ହସ୍ପିଟାଲ' },
    category: 'hospital',
    lat: 28.5672,
    lng: 77.21,
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    rating: 4.7,
    reviewsCount: 31000,
    openNow: true,
    phone: '+91 11-2658-8500',
    tags: ['hospital', 'emergency', 'doctor', 'अस्पताल', 'ଡାକ୍ତରଖାନା', 'medical'],
  },
  {
    id: 'poi-tata-power-ev',
    name: 'Tata Power EV Fast Charger 120kW',
    nativeNames: { hi: 'टाटा पावर ईवी फास्ट चार्जर' },
    category: 'ev',
    lat: 28.6289,
    lng: 77.2065,
    address: 'Connaught Place Block A, New Delhi 110001',
    rating: 4.6,
    reviewsCount: 890,
    openNow: true,
    tags: ['ev', 'charging', 'electric vehicle', 'charger', 'ईवी'],
  },

  // UAE / Middle East
  {
    id: 'poi-burj-khalifa',
    name: 'Burj Khalifa',
    nativeNames: { ar: 'برج خليفة', fa: 'برج خلیفه', ur: 'برج خلیفہ', he: 'בורג׳ ח׳ליפה' },
    category: 'tourist',
    lat: 25.197197,
    lng: 55.274376,
    address: '1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE',
    rating: 4.9,
    reviewsCount: 124000,
    tags: ['dubai', 'skyscraper', 'tourist', 'burj khalifa', 'برج خليفة'],
  },
  {
    id: 'poi-al-mahara-dubai',
    name: 'Al Mahara Luxury Seafood',
    nativeNames: { ar: 'مطعم المهارة الفاخر' },
    category: 'restaurant',
    lat: 25.1412,
    lng: 55.1852,
    address: 'Burj Al Arab Jumeirah, Dubai, UAE',
    rating: 4.8,
    reviewsCount: 3800,
    priceLevel: 4,
    openNow: true,
    tags: ['restaurant', 'seafood', 'luxury', 'مطعم', 'dining'],
  },
  {
    id: 'poi-tesla-supercharger-dubai',
    name: 'Tesla Supercharger V4 - Dubai Mall',
    nativeNames: { ar: 'محطة شحن تسلا الفائقة دبي مول' },
    category: 'ev',
    lat: 25.1985,
    lng: 55.2796,
    address: 'Financial Center Rd, Downtown Dubai, UAE',
    rating: 4.9,
    reviewsCount: 1450,
    openNow: true,
    tags: ['ev', 'tesla', 'supercharger', 'شاحن كهربائي', 'charging'],
  },

  // USA
  {
    id: 'poi-times-square',
    name: 'Times Square',
    nativeNames: { es: 'Times Square Nueva York', 'zh-CN': '时代广场', ja: 'タイムズスクエア' },
    category: 'tourist',
    lat: 40.758896,
    lng: -73.98513,
    address: 'Manhattan, NY 10036, United States',
    rating: 4.7,
    reviewsCount: 110000,
    tags: ['new york', 'times square', 'broadway', 'tourist'],
  },
  {
    id: 'poi-nobu-nyc',
    name: 'Nobu Downtown Restaurant',
    nativeNames: { es: 'Restaurante Nobu Downtown', ja: 'ノブ レストラン' },
    category: 'restaurant',
    lat: 40.7107,
    lng: -74.0094,
    address: '195 Broadway, New York, NY 10007, USA',
    rating: 4.7,
    reviewsCount: 5200,
    priceLevel: 4,
    openNow: true,
    tags: ['restaurant', 'japanese', 'sushi', 'dining', 'food'],
  },
  {
    id: 'poi-ny-presbyterian-hospital',
    name: 'NewYork-Presbyterian Hospital Emergency Center',
    nativeNames: { es: 'Centro de Emergencias NewYork-Presbyterian' },
    category: 'hospital',
    lat: 40.7645,
    lng: -73.9537,
    address: '525 E 68th St, New York, NY 10065, USA',
    rating: 4.8,
    reviewsCount: 18200,
    openNow: true,
    phone: '+1 212-746-5454',
    tags: ['hospital', 'emergency', 'trauma', 'medical'],
  },

  // UK
  {
    id: 'poi-big-ben',
    name: 'Big Ben & Parliament',
    nativeNames: { fr: 'Big Ben et Parlement', de: 'Big Ben London' },
    category: 'tourist',
    lat: 51.500729,
    lng: -0.124625,
    address: 'London SW1A 0AA, United Kingdom',
    rating: 4.8,
    reviewsCount: 88000,
    tags: ['london', 'big ben', 'monument', 'parliament'],
  },

  // Germany
  {
    id: 'poi-brandenburg-gate',
    name: 'Brandenburg Gate',
    nativeNames: { de: 'Brandenburger Tor', fr: 'Porte de Brandebourg' },
    category: 'tourist',
    lat: 52.516275,
    lng: 13.377704,
    address: 'Pariser Platz, 10117 Berlin, Germany',
    rating: 4.8,
    reviewsCount: 92000,
    tags: ['berlin', 'brandenburger tor', 'monument'],
  },

  // China
  {
    id: 'poi-forbidden-city',
    name: 'The Forbidden City',
    nativeNames: { 'zh-CN': '故宫博物院', 'zh-TW': '故宮博物院', ja: '紫禁城' },
    category: 'tourist',
    lat: 39.916345,
    lng: 116.397155,
    address: '4 Jingshan Front St, Dongcheng, Beijing, China',
    rating: 4.9,
    reviewsCount: 140000,
    tags: ['beijing', 'palace', 'forbidden city', '故宫', 'tourist'],
  },

  // Singapore
  {
    id: 'poi-marina-bay-sands',
    name: 'Marina Bay Sands & SkyPark',
    nativeNames: { 'zh-CN': '滨海湾金沙', ms: 'Marina Bay Sands' },
    category: 'hotel',
    lat: 1.2834,
    lng: 103.8607,
    address: '10 Bayfront Ave, Singapore 018956',
    rating: 4.8,
    reviewsCount: 65000,
    priceLevel: 4,
    openNow: true,
    tags: ['hotel', 'resort', 'singapore', 'skypark', 'luxury'],
  },

  // Australia
  {
    id: 'poi-sydney-opera-house',
    name: 'Sydney Opera House',
    nativeNames: { 'zh-CN': '悉尼歌剧院', ja: 'シドニー・オペラハウス' },
    category: 'tourist',
    lat: -33.856784,
    lng: 151.215297,
    address: 'Bennelong Point, Sydney NSW 2000, Australia',
    rating: 4.8,
    reviewsCount: 71000,
    tags: ['sydney', 'opera house', 'harbour', 'australia'],
  },
];

export class GeocodingService {
  public static async searchPlaces(query: string, categoryFilter?: string): Promise<POI[]> {
    const trimmed = query.trim().toLowerCase();

    // 1. Instant local/offline fuzzy match across all names and native scripts
    let results = GLOBAL_POI_DATABASE.filter((poi) => {
      if (categoryFilter && categoryFilter !== 'all' && poi.category !== categoryFilter) {
        return false;
      }

      if (!trimmed) return true;

      // Check standard name
      if (poi.name.toLowerCase().includes(trimmed)) return true;
      // Check address
      if (poi.address.toLowerCase().includes(trimmed)) return true;
      // Check tags
      if (poi.tags?.some((t) => t.toLowerCase().includes(trimmed))) return true;

      // Check native scripts / international names
      if (poi.nativeNames) {
        for (const val of Object.values(poi.nativeNames)) {
          if (val.toLowerCase().includes(trimmed)) return true;
        }
      }

      return false;
    });

    // 2. Optional online Nominatim search if user searches for an arbitrary location not in preset
    if (results.length === 0 && trimmed.length > 2 && typeof window !== 'undefined') {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              'Accept-Language': '*',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const externalPOIs: POI[] = data.map((item: any, idx: number) => ({
              id: `ext-${item.place_id || idx}`,
              name: item.name || item.display_name.split(',')[0],
              category: (item.type === 'restaurant' || item.type === 'cafe'
                ? 'restaurant'
                : item.type === 'hospital'
                ? 'hospital'
                : item.type === 'fuel'
                ? 'gas'
                : item.type === 'hotel'
                ? 'hotel'
                : 'tourist') as any,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.display_name,
              rating: 4.6,
              reviewsCount: 1500,
              tags: [item.type, item.class],
            }));
            results = [...results, ...externalPOIs];
          }
        }
      } catch {
        // graceful offline fallback
      }
    }

    return results;
  }
}
