// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Wallet,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  WifiOff,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Plus,
  Minus,
  ExternalLink,
  LogOut,
  KeyRound,
  Layers,
  Terminal,
  Zap,
  RotateCcw,
  Lock,
  ArrowLeft,
  FileText,
  Globe
} from 'lucide-react';

const ETH_SCALE = 1000000;
const ETH_BRL_RATE = 16450;

function toMicroEth(value) {
  if (!value || typeof value !== 'string') return 0;
  const sanitized = value.trim().replace(/[^0-9.]/g, '');
  if (!sanitized) return 0;
  const parts = sanitized.split('.');
  const whole = parts[0] || '0';
  const fraction = parts[1] || '';
  const paddedFraction = (fraction + '000000').slice(0, 6);
  return parseInt(whole, 10) * ETH_SCALE + parseInt(paddedFraction, 10);
}

function fromMicroEth(units, precision = 4) {
  const rounded = Math.round(units);
  const negative = rounded < 0;
  const abs = Math.abs(rounded);
  const whole = Math.floor(abs / ETH_SCALE);
  const rem = String(abs % ETH_SCALE).padStart(6, '0').slice(0, precision);
  return (negative ? '-' : '') + whole + '.' + rem;
}

function sumEth(a, b) {
  return fromMicroEth(toMicroEth(a) + toMicroEth(b));
}

function subtractEth(a, b) {
  const diff = toMicroEth(a) - toMicroEth(b);
  return fromMicroEth(diff > 0 ? diff : 0);
}

function multiplyEth(eth, qty) {
  return fromMicroEth(toMicroEth(eth) * Math.max(0, Math.floor(qty)));
}

function percentageEth(eth, pct) {
  const units = toMicroEth(eth);
  return fromMicroEth(Math.floor((units * Math.floor(pct)) / 100));
}

function compareEthValues(a, b) {
  const ua = toMicroEth(a);
  const ub = toMicroEth(b);
  return ua === ub ? 0 : ua < ub ? -1 : 1;
}

function formatBrl(ethStr) {
  const numeric = parseFloat(ethStr || '0');
  return (numeric * ETH_BRL_RATE).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function TokenArtwork({ item, className = 'w-full h-full' }) {
  const colorMap = {
    'nft-1': ['#8B5CF6', '#06B6D4', '#0F172A', '#EC4899'],
    'nft-2': ['#10B981', '#06B6D4', '#090D16', '#3B82F6'],
    'nft-3': ['#F59E0B', '#EF4444', '#18181B', '#8B5CF6'],
    'nft-4': ['#EC4899', '#8B5CF6', '#090A0F', '#06B6D4'],
    'nft-5': ['#06B6D4', '#3B82F6', '#0B0F19', '#A855F7'],
    'nft-6': ['#A855F7', '#F43F5E', '#111827', '#14B8A6'],
    'nft-7': ['#3B82F6', '#10B981', '#090A0F', '#6366F1'],
    'nft-8': ['#F43F5E', '#F59E0B', '#0F172A', '#8B5CF6']
  };
  const palette = colorMap[item.id] || colorMap['nft-1'];
  const primary = palette[0];
  const secondary = palette[1];
  const surface = palette[2];
  const accent = palette[3];
  const idx = parseInt(item.id.replace('nft-', ''), 10) || 1;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className + ' select-none overflow-hidden'}
      role="img"
      aria-label={'Obra digital ' + item.title + ' por ' + item.creator}
    >
      <defs>
        <radialGradient id={'radial-' + item.id} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={primary} stopOpacity="0.45" />
          <stop offset="55%" stopColor={secondary} stopOpacity="0.2" />
          <stop offset="100%" stopColor={surface} stopOpacity="1" />
        </radialGradient>
        <linearGradient id={'linear-' + item.id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primary} />
          <stop offset="50%" stopColor={secondary} />
          <stop offset="100%" stopColor={accent} />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill={surface} />
      <rect width="400" height="400" fill={'url(#radial-' + item.id + ')'} />

      <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
        {[50, 100, 150, 200, 250, 300, 350].map((coord) => (
          <React.Fragment key={coord}>
            <line x1={coord} y1="0" x2={coord} y2="400" />
            <line x1="0" y1={coord} x2="400" y2={coord} />
          </React.Fragment>
        ))}
      </g>

      <g transform="translate(200, 195)">
        <circle
          r={110 + (idx % 3) * 12}
          fill="none"
          stroke={'url(#linear-' + item.id + ')'}
          strokeWidth="1.5"
          strokeDasharray={idx % 2 === 0 ? '8 6' : 'none'}
          opacity="0.5"
        />
        <circle r={82} fill="none" stroke={secondary} strokeWidth="2" opacity="0.35" />

        {idx % 3 === 0 && (
          <polygon
            points="0,-95 86,50 -86,50"
            fill={'url(#linear-' + item.id + ')'}
            fillOpacity="0.22"
            stroke={'url(#linear-' + item.id + ')'}
            strokeWidth="3"
          />
        )}
        {idx % 3 === 1 && (
          <g>
            <rect
              x="-70"
              y="-70"
              width="140"
              height="140"
              rx="24"
              transform={'rotate(' + idx * 15 + ')'}
              fill={'url(#linear-' + item.id + ')'}
              fillOpacity="0.2"
              stroke={'url(#linear-' + item.id + ')'}
              strokeWidth="2.5"
            />
            <rect
              x="-50"
              y="-50"
              width="100"
              height="100"
              rx="16"
              transform={'rotate(' + -idx * 20 + ')'}
              fill="none"
              stroke={accent}
              strokeWidth="2"
            />
          </g>
        )}
        {idx % 3 === 2 && (
          <polygon
            points="0,-100 90,-30 55,85 -55,85 -90,-30"
            fill={'url(#linear-' + item.id + ')'}
            fillOpacity="0.25"
            stroke={'url(#linear-' + item.id + ')'}
            strokeWidth="2.5"
          />
        )}

        <circle r="36" fill={'url(#linear-' + item.id + ')'} opacity="0.85" />
        <circle r="16" fill="#FFFFFF" opacity="0.9" />
      </g>

      <g fill="rgba(255,255,255,0.45)" fontFamily="monospace" fontSize="10">
        <text x="20" y="28">#{String(idx).padStart(4, '0')}</text>
        <text x="320" y="28">v{item.version}</text>
        <text x="20" y="382">{item.network.toUpperCase()}</text>
      </g>
    </svg>
  );
}

const SEED_NFTS = [
  {
    id: 'nft-1',
    title: 'Aether Chronos #01',
    collection: 'Chronos Genesis',
    creator: '@kairo.eth',
    category: 'Arte Digital',
    network: 'Ethereum',
    priceEth: '1.4500',
    totalEditions: 10,
    availableEditions: 4,
    likes: 342,
    featured: true,
    version: 1,
    createdAt: '2026-11-01T10:00:00Z',
    contractAddress: '0x71C...89A2',
    tokenStandard: 'ERC-1155',
    royalties: '7.5%',
    description:
      'Escultura temporal generativa renderizada em camadas de refração quântica. Cada edição garante acesso ao vault interativo da coleção Chronos Genesis.',
    attributes: [
      { trait: 'Dimensão', value: 'Hiperespaço IV', rarity: '4%' },
      { trait: 'Núcleo', value: 'Violeta Elétrico', rarity: '12%' },
      { trait: 'Frequência', value: '432 Hz', rarity: '9%' }
    ],
    priceHistory: [
      { date: 'Out 2026', priceEth: '1.1000' },
      { date: 'Nov 2026', priceEth: '1.3000' },
      { date: 'Atual', priceEth: '1.4500' }
    ]
  },
  {
    id: 'nft-2',
    title: 'Cyber Samurai: Neo-Kyoto',
    collection: 'Ronin Protocol',
    creator: '@akira.vax',
    category: 'Colecionáveis',
    network: 'Polygon',
    priceEth: '0.6800',
    totalEditions: 25,
    availableEditions: 2,
    likes: 518,
    featured: false,
    version: 1,
    createdAt: '2026-11-03T14:20:00Z',
    contractAddress: '0x38F...21B9',
    tokenStandard: 'ERC-1155',
    royalties: '5.0%',
    description:
      'Guardião cibernético forjado na rede Polygon com armadura reativa a eventos on-chain e insígnia holográfica verificada.',
    attributes: [
      { trait: 'Clã', value: 'Zero-Knowledge', rarity: '6%' },
      { trait: 'Lâmina', value: 'Plasma Ciano', rarity: '15%' },
      { trait: 'Aura', value: 'Esmeralda', rarity: '8%' }
    ],
    priceHistory: [
      { date: 'Set 2026', priceEth: '0.4500' },
      { date: 'Out 2026', priceEth: '0.5800' },
      { date: 'Atual', priceEth: '0.6800' }
    ]
  },
  {
    id: 'nft-3',
    title: 'Solaris Singularity #88',
    collection: 'Astral Horizons',
    creator: '@lyra.sol',
    category: 'Generativo',
    network: 'Ethereum',
    priceEth: '2.2000',
    totalEditions: 5,
    availableEditions: 1,
    likes: 890,
    featured: false,
    version: 1,
    createdAt: '2026-11-05T09:15:00Z',
    contractAddress: '0x99A...44C1',
    tokenStandard: 'ERC-721',
    royalties: '10.0%',
    description:
      'Algoritmo de colapso estelar capturado no bloco 19.482.110. Edição escassa com parâmetros derivados do hash de criação.',
    attributes: [
      { trait: 'Classe Estelar', value: 'Supernova', rarity: '2%' },
      { trait: 'Gravidade', value: 'Extrema', rarity: '5%' },
      { trait: 'Espectro', value: 'Âmbar Solar', rarity: '11%' }
    ],
    priceHistory: [
      { date: 'Out 2026', priceEth: '1.8500' },
      { date: 'Nov 2026', priceEth: '2.0500' },
      { date: 'Atual', priceEth: '2.2000' }
    ]
  },
  {
    id: 'nft-4',
    title: 'Obsidian Echoes #14',
    collection: 'Void Harmonics',
    creator: '@noctis.sound',
    category: 'Música & Áudio',
    network: 'Arbitrum',
    priceEth: '0.4200',
    totalEditions: 50,
    availableEditions: 18,
    likes: 215,
    featured: false,
    version: 1,
    createdAt: '2026-10-28T18:40:00Z',
    contractAddress: '0x52D...77E0',
    tokenStandard: 'ERC-1155',
    royalties: '6.0%',
    description:
      'Sintetizador audiovisual modular armazenado de forma imutável. Inclui stems masterizados em 24-bit e geometria reativa.',
    attributes: [
      { trait: 'BPM', value: '128 Techno', rarity: '14%' },
      { trait: 'Timbre', value: 'Sub-Bass Analógico', rarity: '9%' },
      { trait: 'Escala', value: 'Frígio Menor', rarity: '7%' }
    ],
    priceHistory: [
      { date: 'Set 2026', priceEth: '0.3500' },
      { date: 'Out 2026', priceEth: '0.4000' },
      { date: 'Atual', priceEth: '0.4200' }
    ]
  },
  {
    id: 'nft-5',
    title: 'Monolith of Turing',
    collection: 'Neural Relics',
    creator: '@ada.compute',
    category: 'Fotografia 3D',
    network: 'Ethereum',
    priceEth: '3.1000',
    totalEditions: 3,
    availableEditions: 0,
    likes: 1120,
    featured: false,
    version: 1,
    createdAt: '2026-10-19T11:00:00Z',
    contractAddress: '0x11B...90F4',
    tokenStandard: 'ERC-721',
    royalties: '8.0%',
    description:
      'Monólito escaneado em fotogrametria laser sub-milimétrica e reconstruído em shaders ray-traced de estado sólido.',
    attributes: [
      { trait: 'Material', value: 'Obsidiana Líquida', rarity: '1%' },
      { trait: 'Polígonos', value: '4.2M Mesh', rarity: '5%' },
      { trait: 'Iluminação', value: 'Ciano Global', rarity: '10%' }
    ],
    priceHistory: [
      { date: 'Ago 2026', priceEth: '2.1000' },
      { date: 'Out 2026', priceEth: '2.8000' },
      { date: 'Atual', priceEth: '3.1000' }
    ]
  },
  {
    id: 'nft-6',
    title: 'Prism Valkyrie #07',
    collection: 'Cyber Pantheon',
    creator: '@freya.art',
    category: 'Arte Digital',
    network: 'Polygon',
    priceEth: '0.9500',
    totalEditions: 15,
    availableEditions: 7,
    likes: 430,
    featured: false,
    version: 1,
    createdAt: '2026-11-06T16:10:00Z',
    contractAddress: '0x64E...12A8',
    tokenStandard: 'ERC-1155',
    royalties: '7.0%',
    description:
      'Retrato vetorial de alta densidade com dispersão cromática inspirada na mitologia nórdica pós-industrial.',
    attributes: [
      { trait: 'Asas', value: 'Fibra Óptica', rarity: '8%' },
      { trait: 'Coroa', value: 'Quartzo Rosa', rarity: '12%' },
      { trait: 'Nível', value: 'Ascendente', rarity: '4%' }
    ],
    priceHistory: [
      { date: 'Out 2026', priceEth: '0.8000' },
      { date: 'Atual', priceEth: '0.9500' }
    ]
  },
  {
    id: 'nft-7',
    title: 'Quantum Arboretum #23',
    collection: 'BioSynth Flora',
    creator: '@eden.labs',
    category: 'Generativo',
    network: 'Arbitrum',
    priceEth: '0.5500',
    totalEditions: 20,
    availableEditions: 9,
    likes: 278,
    featured: false,
    version: 1,
    createdAt: '2026-11-04T08:30:00Z',
    contractAddress: '0x82C...33D1',
    tokenStandard: 'ERC-1155',
    royalties: '5.0%',
    description:
      'Flora algorítmica que evolui conforme a entropia de blocos da rede Arbitrum. Sementes botânicas matemáticas puras.',
    attributes: [
      { trait: 'Espécie', value: 'Filodendro Neon', rarity: '11%' },
      { trait: 'Clorofila', value: 'Bioluminescente', rarity: '6%' },
      { trait: 'Estação', value: 'Perpétua', rarity: '18%' }
    ],
    priceHistory: [
      { date: 'Out 2026', priceEth: '0.5000' },
      { date: 'Atual', priceEth: '0.5500' }
    ]
  },
  {
    id: 'nft-8',
    title: 'Hyperion Drift #04',
    collection: 'Velocity Vectors',
    creator: '@vortex.studio',
    category: 'Fotografia 3D',
    network: 'Ethereum',
    priceEth: '1.8000',
    totalEditions: 8,
    availableEditions: 2,
    likes: 645,
    featured: false,
    version: 1,
    createdAt: '2026-11-07T12:00:00Z',
    contractAddress: '0x45A...67B2',
    tokenStandard: 'ERC-1155',
    royalties: '7.5%',
    description:
      'Captura aerodinâmica em túnel de vento virtual com partículas de fluido rastreadas em tempo real.',
    attributes: [
      { trait: 'Velocidade', value: 'Mach 4.2', rarity: '5%' },
      { trait: 'Chassi', value: 'Titânio Anodizado', rarity: '9%' },
      { trait: 'Traçado', value: 'Fóton Carmesim', rarity: '13%' }
    ],
    priceHistory: [
      { date: 'Out 2026', priceEth: '1.5000' },
      { date: 'Atual', priceEth: '1.8000' }
    ]
  }
];

const SEED_USERS = [
  {
    id: 'user-1',
    name: 'Marina Silva',
    email: 'colecionador@nft.io',
    passwordHash: 'sha256_123456',
    handle: '@marina.eth',
    bio: 'Curadora de arte generativa e colecionadora Web3 desde 2021.',
    avatarColor: '#8B5CF6',
    document: '128.459.021-90',
    favorites: ['nft-1', 'nft-3'],
    wallets: [
      {
        id: 'wal-1',
        label: 'MetaMask Principal',
        address: '0x71C8F903A1B4D7E290F441C8E6D2A19B004F89A2',
        network: 'Ethereum',
        isPrimary: true
      },
      {
        id: 'wal-2',
        label: 'Ledger Polygon L2',
        address: '0x94D2B811E5F309A7C412B9008E11D3F6A721C409',
        network: 'Polygon',
        isPrimary: false
      }
    ]
  },
  {
    id: 'user-2',
    name: 'Viktor Vance',
    email: 'whale@nft.io',
    passwordHash: 'sha256_123456',
    handle: '@viktor.whale',
    bio: 'Colecionador focado em edições limitadas e fotografia 3D.',
    avatarColor: '#06B6D4',
    document: '904.112.874-15',
    favorites: ['nft-5', 'nft-8'],
    wallets: [
      {
        id: 'wal-3',
        label: 'Safe Multisig Vault',
        address: '0x19A00F48B229C81E7734D5910A2B3C4D5E6F7711',
        network: 'Ethereum',
        isPrimary: true
      },
      {
        id: 'wal-4',
        label: 'Arbitrum Cold Storage',
        address: '0x55E12D98A43F10C7B882190A3E4D1C2B9A8F1102',
        network: 'Arbitrum',
        isPrimary: false
      }
    ]
  }
];

const COUPONS = {
  WEB3VIP: { code: 'WEB3VIP', discountPercent: 10, expired: false },
  GENESIS20: { code: 'GENESIS20', discountPercent: 20, expired: false },
  EXPIRED10: { code: 'EXPIRED10', discountPercent: 10, expired: true }
};

const GAS_FEES = {
  Ethereum: '0.0120',
  Polygon: '0.0015',
  Arbitrum: '0.0025'
};

const DB_STORAGE_KEY = 'nft_marketplace_mock_state_v1';

function readPersistedState() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.nfts) && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore storage errors
  }
  return {
    nfts: JSON.parse(JSON.stringify(SEED_NFTS)),
    users: JSON.parse(JSON.stringify(SEED_USERS)),
    cartsByUser: {
      guest: [{ nftId: 'nft-1', quantity: 1 }],
      'user-1': [{ nftId: 'nft-2', quantity: 1 }],
      'user-2': []
    },
    couponsByUser: {
      guest: null,
      'user-1': null,
      'user-2': null
    },
    orders: [],
    idempotencyRegistry: {}
  };
}

function writePersistedState(state) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore quota errors
  }
}

export default function App() {
  const [db, setDb] = useState(() => readPersistedState());
  const dbRef = useRef(db);

  useEffect(() => {
    dbRef.current = db;
    writePersistedState(db);
  }, [db]);

  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      return localStorage.getItem('nft_session_uid') || null;
    } catch (e) {
      return null;
    }
  });
  const [sessionExpiredAlert, setSessionExpiredAlert] = useState(false);
  const [pendingRedirectRoute, setPendingRedirectRoute] = useState(null);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return db.users.find((u) => u.id === currentUserId) || null;
  }, [db.users, currentUserId]);

  const cartOwnerKey = currentUser ? currentUser.id : 'guest';

  const [route, setRoute] = useState({
    path: '/',
    params: {},
    search: {
      q: '',
      category: 'Todos',
      status: 'Todos',
      network: 'Todas',
      minEth: '',
      maxEth: '',
      sort: 'popular',
      page: 1
    }
  });

  const [historyStack, setHistoryStack] = useState([route]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const urlPreview = useMemo(() => {
    const { path, params, search } = route;
    let resolved = path;
    if (path === '/nft/:id' && params.id) resolved = '/nft/' + params.id;
    if (path === '/order/:id' && params.id) resolved = '/order/' + params.id;
    if (path !== '/') return resolved;

    const query = new URLSearchParams();
    if (search.q) query.set('q', search.q);
    if (search.category !== 'Todos') query.set('category', search.category);
    if (search.status !== 'Todos') query.set('status', search.status);
    if (search.network !== 'Todas') query.set('network', search.network);
    if (search.minEth) query.set('minEth', search.minEth);
    if (search.maxEth) query.set('maxEth', search.maxEth);
    if (search.sort !== 'popular') query.set('sort', search.sort);
    if (search.page > 1) query.set('page', String(search.page));

    const qs = query.toString();
    return qs ? '/?' + qs : '/';
  }, [route]);

  const navigate = useCallback(
    (nextPath, nextParams = {}, nextSearchPartial = null) => {
      setRoute((prev) => {
        const mergedSearch = nextSearchPartial
          ? { ...prev.search, ...nextSearchPartial }
          : prev.search;
        const nextEntry = { path: nextPath, params: nextParams, search: mergedSearch };
        setHistoryStack((stack) => [...stack.slice(0, historyIdx + 1), nextEntry]);
        setHistoryIdx((idx) => idx + 1);
        return nextEntry;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [historyIdx]
  );

  const updateFilters = useCallback(
    (changes) => {
      const resetPagination = Object.keys(changes).some((k) => k !== 'page');
      const nextSearch = {
        ...route.search,
        ...changes,
        page: resetPagination ? 1 : changes.page || route.search.page
      };
      navigate('/', {}, nextSearch);
    },
    [route.search, navigate]
  );

  const navigateBack = () => {
    if (historyIdx > 0) {
      const prevIdx = historyIdx - 1;
      setHistoryIdx(prevIdx);
      setRoute(historyStack[prevIdx]);
    }
  };

  const navigateForward = () => {
    if (historyIdx < historyStack.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setRoute(historyStack[nextIdx]);
    }
  };

  const [latencyMs, setLatencyMs] = useState(180);
  const [faultMode, setFaultMode] = useState('NONE');
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);
  const [socketOnline, setSocketOnline] = useState(true);
  const [transportLogs, setTransportLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const seenSocketVersions = useRef({});
  const activeFetchId = useRef(0);

  const notify = useCallback((title, message, variant = 'info') => {
    const id = Date.now() + '-' + Math.random();
    setNotifications((prev) => [{ id, title, message, variant }, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  }, []);

  const recordLog = useCallback((channel, operation, resource, status, summary) => {
    const entry = {
      id: Date.now() + '-' + Math.random(),
      time: new Date().toLocaleTimeString('pt-BR', { hour12: false }),
      channel,
      operation,
      resource,
      status,
      summary
    };
    setTransportLogs((prev) => [entry, ...prev.slice(0, 29)]);
  }, []);

  const requestApi = useCallback(
    async (method, url, resolver, opts = {}) => {
      const wait = opts.customLatency !== undefined ? opts.customLatency : latencyMs;
      await new Promise((resolve) => setTimeout(resolve, wait));

      if (faultMode === 'HTTP_401' && !opts.skipAuthCheck) {
        setFaultMode('NONE');
        recordLog('REST', method, url, 401, 'Sessão expirada (401)');
        setSessionExpiredAlert(true);
        setPendingRedirectRoute(route);
        setCurrentUserId(null);
        try {
          localStorage.removeItem('nft_session_uid');
        } catch (e) {}
        notify(
          'Sessão Expirada',
          'Sua sessão expirou. Faça login novamente para continuar de onde parou.',
          'warning'
        );
        navigate('/login');
        const error = new Error('Sessão expirada.');
        error.status = 401;
        throw error;
      }

      if (faultMode === 'HTTP_500' && !opts.skip500) {
        setFaultMode('NONE');
        recordLog('REST', method, url, 500, 'Erro interno simulado (500)');
        const error = new Error('Falha temporária na API (HTTP 500).');
        error.status = 500;
        throw error;
      }

      const response = resolver();
      recordLog('REST', method, url, (response && response.status) || 200, (response && response.summary) || 'OK');
      return response.data;
    },
    [latencyMs, faultMode, recordLog, route, notify, navigate]
  );

  useEffect(() => {
    if (route.path !== '/') return;
    const fetchId = ++activeFetchId.current;
    setCatalogLoading(true);
    setCatalogError(null);

    requestApi('GET', '/api/nfts' + urlPreview.replace('/', ''), () => ({
      status: 200,
      summary: 'Listagem carregada',
      data: true
    }))
      .then(() => {
        if (fetchId === activeFetchId.current) {
          setCatalogLoading(false);
        }
      })
      .catch((err) => {
        if (fetchId === activeFetchId.current) {
          setCatalogLoading(false);
          if (err.status !== 401) {
            setCatalogError(err.message);
          }
        }
      });
  }, [route.path, urlPreview, requestApi]);

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponValidationError, setCouponValidationError] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [cartSocketNotices, setCartSocketNotices] = useState({});
  const [quoteRequiresRevalidation, setQuoteRequiresRevalidation] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');

  const cartLines = useMemo(() => {
    const raw = db.cartsByUser[cartOwnerKey] || [];
    return raw
      .map((entry) => {
        const nft = db.nfts.find((item) => item.id === entry.nftId);
        if (!nft) return null;
        return {
          ...entry,
          nft,
          lineTotalEth: multiplyEth(nft.priceEth, entry.quantity),
          outOfStock: entry.quantity > nft.availableEditions || nft.availableEditions === 0
        };
      })
      .filter(Boolean);
  }, [db.cartsByUser, db.nfts, cartOwnerKey]);

  const appliedCoupon = useMemo(() => {
    const code = db.couponsByUser[cartOwnerKey];
    return code ? COUPONS[code] || null : null;
  }, [db.couponsByUser, cartOwnerKey]);

  const quoteSummary = useMemo(() => {
    const subtotalEth = cartLines.reduce((acc, item) => sumEth(acc, item.lineTotalEth), '0.0000');
    const discountEth = appliedCoupon
      ? percentageEth(subtotalEth, appliedCoupon.discountPercent)
      : '0.0000';
    const netSubtotal = subtractEth(subtotalEth, discountEth);
    const networkFeeEth =
      cartLines.length > 0 ? GAS_FEES[selectedNetwork] || '0.0120' : '0.0000';
    const totalEth = cartLines.length > 0 ? sumEth(netSubtotal, networkFeeEth) : '0.0000';

    return {
      subtotalEth,
      discountEth,
      networkFeeEth,
      totalEth,
      totalBrl: formatBrl(totalEth),
      itemCount: cartLines.reduce((acc, item) => acc + item.quantity, 0),
      hasStockConflict: cartLines.some((item) => item.outOfStock)
    };
  }, [cartLines, appliedCoupon, selectedNetwork]);

  const dispatchSocketEvent = useCallback(
    (eventName, payload) => {
      if (!socketOnline) {
        recordLog(
          'SOCKET',
          eventName,
          payload.id || 'bus',
          'OFFLINE',
          'Evento não entregue (cliente desconectado)'
        );
        notify(
          'Socket Desconectado',
          'Evento ' + eventName + ' retido. Reconecte para sincronizar via REST.',
          'warning'
        );
        return;
      }

      if (payload.targetUserId && payload.targetUserId !== (currentUser ? currentUser.id : 'guest')) {
        recordLog('SOCKET', eventName, payload.id, 'ISOLATED', 'Ignorado: pertence a outra sessão');
        return;
      }

      const versionKey = eventName + ':' + payload.id;
      const lastVersion = seenSocketVersions.current[versionKey] !== undefined ? seenSocketVersions.current[versionKey] : 1;

      if (payload.version <= lastVersion) {
        const msg =
          payload.version === lastVersion
            ? 'Evento duplicado descartado (v' + payload.version + ')'
            : 'Evento antigo descartado (v' + payload.version + ' < v' + lastVersion + ')';
        recordLog('SOCKET', eventName, payload.id, 'IGNORED', msg);
        notify('Filtro de Versão Socket.IO', msg, 'info');
        return;
      }

      seenSocketVersions.current[versionKey] = payload.version;

      if (eventName === 'nft.updated') {
        const { id, priceEth, availableEditions, version } = payload;
        const previous = dbRef.current.nfts.find((item) => item.id === id);
        if (!previous) return;

        setDb((prev) => ({
          ...prev,
          nfts: prev.nfts.map((item) =>
            item.id === id
              ? {
                  ...item,
                  priceEth: priceEth !== undefined ? priceEth : item.priceEth,
                  availableEditions:
                    availableEditions !== undefined ? availableEditions : item.availableEditions,
                  version
                }
              : item
          )
        }));

        recordLog(
          'SOCKET',
          'nft.updated',
          id,
          'v' + version,
          'Preço ' + priceEth + ' ETH | Estoque ' + availableEditions
        );

        const presentInCart = (dbRef.current.cartsByUser[cartOwnerKey] || []).some(
          (entry) => entry.nftId === id
        );

        if (presentInCart) {
          const depleted = availableEditions === 0;
          setCartSocketNotices((prev) => ({
            ...prev,
            [id]: {
              type: depleted ? 'SOLD_OUT' : 'PRICE_CHANGED',
              oldPriceEth: previous.priceEth,
              newPriceEth: priceEth,
              availableEditions,
              version,
              title: previous.title
            }
          }));
          setQuoteRequiresRevalidation(true);
          notify(
            depleted ? 'Edição Esgotada no Carrinho' : 'Preço Atualizado no Carrinho',
            depleted
              ? '"' + previous.title + '" ficou sem estoque (v' + version + ').'
              : '"' + previous.title + '" passou de ' + previous.priceEth + ' ETH para ' + priceEth + ' ETH (v' + version + ').',
            'warning'
          );
        } else {
          notify(
            'Atualização em Tempo Real',
            '"' + previous.title + '" atualizado para ' + priceEth + ' ETH (' + availableEditions + ' disp.)',
            'info'
          );
        }
      }

      if (eventName === 'order.updated') {
        const { id, status, version, txHash, failureReason } = payload;
        const existingOrder = dbRef.current.orders.find((o) => o.id === id);
        if (!existingOrder) return;

        if (existingOrder.status === 'CONFIRMED' || existingOrder.status === 'DECLINED') {
          recordLog(
            'SOCKET',
            'order.updated',
            id,
            'TERMINAL',
            'Pedido já finalizado (' + existingOrder.status + ')'
          );
          return;
        }

        setDb((prev) => {
          const orders = prev.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  version,
                  txHash: txHash || o.txHash,
                  failureReason: failureReason || null,
                  updatedAt: new Date().toISOString()
                }
              : o
          );

          const cartsByUser = { ...prev.cartsByUser };
          let nfts = [...prev.nfts];

          if (status === 'CONFIRMED') {
            const owner = existingOrder.userId;
            const currentCart = cartsByUser[owner] || [];
            const remaining = [];

            currentCart.forEach((cartItem) => {
              const bought = existingOrder.items.find((i) => i.nftId === cartItem.nftId);
              if (!bought) {
                remaining.push(cartItem);
              } else {
                const diff = cartItem.quantity - bought.quantity;
                if (diff > 0) {
                  remaining.push({ ...cartItem, quantity: diff });
                }
              }
            });
            cartsByUser[owner] = remaining;

            nfts = nfts.map((nft) => {
              const bought = existingOrder.items.find((i) => i.nftId === nft.id);
              if (!bought) return nft;
              return {
                ...nft,
                availableEditions: Math.max(0, nft.availableEditions - bought.quantity)
              };
            });
          }

          return { ...prev, orders, cartsByUser, nfts };
        });

        recordLog('SOCKET', 'order.updated', id, status, 'Status alterado para ' + status + ' (v' + version + ')');

        if (status === 'CONFIRMED') {
          notify('Pedido Confirmado', 'Transação ' + id + ' confirmada na rede.', 'success');
        } else if (status === 'DECLINED') {
          notify(
            'Pagamento Recusado',
            'O pedido ' + id + ' foi recusado. Os itens permanecem no seu carrinho.',
            'error'
          );
        }
      }
    },
    [socketOnline, currentUser, cartOwnerKey, recordLog, notify]
  );

  const handleSocketToggle = async () => {
    if (socketOnline) {
      setSocketOnline(false);
      recordLog('SOCKET', 'disconnect', 'ws://localhost', 'OFFLINE', 'Transporte desconectado');
      notify('Socket.IO Desconectado', 'Eventos em tempo real pausados.', 'warning');
    } else {
      setSocketOnline(true);
      recordLog('SOCKET', 'connect', 'ws://localhost', 'ONLINE', 'Reconectado; reconciliando caches');
      await requestApi('GET', '/api/reconcile', () => {
        dbRef.current.nfts.forEach((item) => {
          seenSocketVersions.current['nft.updated:' + item.id] = item.version;
        });
        dbRef.current.orders.forEach((ord) => {
          seenSocketVersions.current['order.updated:' + ord.id] = ord.version;
        });
        return { status: 200, summary: 'Caches sincronizados com a API REST', data: true };
      });
      notify('Socket.IO Reconectado', 'Catálogo, carrinho e pedidos reconciliados via REST.', 'success');
    }
  };

  const addToCart = async (nft, quantity = 1, openDrawer = true) => {
    if (nft.availableEditions === 0) {
      notify('Indisponível', 'Esta edição está esgotada.', 'error');
      return;
    }

    const currentItems = db.cartsByUser[cartOwnerKey] || [];
    const existing = currentItems.find((i) => i.nftId === nft.id);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > nft.availableEditions) {
      notify(
        'Limite de Disponibilidade',
        'Restam apenas ' + nft.availableEditions + ' edição(ões) de "' + nft.title + '".',
        'warning'
      );
      return;
    }

    try {
      await requestApi('POST', '/api/cart/items', () => {
        setDb((prev) => {
          const list = prev.cartsByUser[cartOwnerKey] || [];
          const hasItem = list.some((i) => i.nftId === nft.id);
          const updated = hasItem
            ? list.map((i) => (i.nftId === nft.id ? { ...i, quantity: nextQty } : i))
            : [...list, { nftId: nft.id, quantity }];
          return {
            ...prev,
            cartsByUser: { ...prev.cartsByUser, [cartOwnerKey]: updated }
          };
        });
        return { status: 200, summary: 'Item ' + nft.id + ' (' + quantity + 'x) incluído', data: true };
      });
      notify('Carrinho Atualizado', quantity + 'x "' + nft.title + '" adicionado.', 'success');
      if (openDrawer) setCartDrawerOpen(true);
    } catch (err) {
      if (err.status !== 401) notify('Erro', err.message, 'error');
    }
  };

  const changeCartQty = async (nftId, nextQty) => {
    const nft = db.nfts.find((item) => item.id === nftId);
    if (!nft) return;
    if (nextQty <= 0) return removeCartItem(nftId);

    if (nextQty > nft.availableEditions) {
      notify('Limite Atingido', 'Apenas ' + nft.availableEditions + ' edições disponíveis.', 'warning');
      return;
    }

    try {
      await requestApi('PATCH', '/api/cart/items/' + nftId, () => {
        setDb((prev) => ({
          ...prev,
          cartsByUser: {
            ...prev.cartsByUser,
            [cartOwnerKey]: (prev.cartsByUser[cartOwnerKey] || []).map((i) =>
              i.nftId === nftId ? { ...i, quantity: nextQty } : i
            )
          }
        }));
        return { status: 200, summary: 'Quantidade atualizada para ' + nextQty, data: true };
      });
    } catch (err) {
      if (err.status !== 401) notify('Erro', err.message, 'error');
    }
  };

  const removeCartItem = async (nftId) => {
    try {
      await requestApi('DELETE', '/api/cart/items/' + nftId, () => {
        setDb((prev) => ({
          ...prev,
          cartsByUser: {
            ...prev.cartsByUser,
            [cartOwnerKey]: (prev.cartsByUser[cartOwnerKey] || []).filter((i) => i.nftId !== nftId)
          }
        }));
        setCartSocketNotices((prev) => {
          const next = { ...prev };
          delete next[nftId];
          return next;
        });
        return { status: 200, summary: 'Item ' + nftId + ' removido', data: true };
      });
    } catch (err) {
      if (err.status !== 401) notify('Erro', err.message, 'error');
    }
  };

  const applyCoupon = async (e) => {
    if (e) e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) return;

    setApplyingCoupon(true);
    setCouponValidationError(null);

    try {
      await requestApi('POST', '/api/quote/coupon', () => {
        const coupon = COUPONS[code];
        if (!coupon) {
          const err = new Error('Cupom "' + code + '" inválido.');
          err.status = 404;
          throw err;
        }
        if (coupon.expired) {
          const err = new Error('O cupom "' + code + '" está expirado.');
          err.status = 422;
          throw err;
        }
        setDb((prev) => ({
          ...prev,
          couponsByUser: { ...prev.couponsByUser, [cartOwnerKey]: code }
        }));
        return { status: 200, summary: 'Cupom ' + code + ' aplicado', data: coupon };
      });
      setCouponCodeInput('');
      notify('Cupom Aplicado', 'Desconto de ' + COUPONS[code].discountPercent + '% ativado.', 'success');
    } catch (err) {
      recordLog('REST', 'POST', '/api/quote/coupon', err.status || 400, err.message);
      setCouponValidationError(err.message);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = async () => {
    await requestApi('DELETE', '/api/quote/coupon', () => {
      setDb((prev) => ({
        ...prev,
        couponsByUser: { ...prev.couponsByUser, [cartOwnerKey]: null }
      }));
      return { status: 200, summary: 'Cupom removido', data: true };
    });
    setCouponValidationError(null);
  };

  const [optimisticFavorites, setOptimisticFavorites] = useState({});

  const toggleFavorite = async (nftId, e) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      notify('Login Necessário', 'Entre na sua conta para salvar favoritos.', 'info');
      setPendingRedirectRoute(route);
      navigate('/login');
      return;
    }

    const isFav = currentUser.favorites.includes(nftId);
    const nextState = !isFav;

    setOptimisticFavorites((prev) => ({ ...prev, [nftId]: nextState }));

    try {
      await requestApi(nextState ? 'POST' : 'DELETE', '/api/favorites/' + nftId, () => {
        if (faultMode === 'FAVORITE_FAIL') {
          setFaultMode('NONE');
          const err = new Error('Erro ao gravar favorito (Rollback aplicado).');
          err.status = 503;
          throw err;
        }

        setDb((prev) => ({
          ...prev,
          users: prev.users.map((u) => {
            if (u.id !== currentUser.id) return u;
            const updatedFavs = nextState
              ? Array.from(new Set([...u.favorites, nftId]))
              : u.favorites.filter((id) => id !== nftId);
            return { ...u, favorites: updatedFavs };
          }),
          nfts: prev.nfts.map((n) =>
            n.id === nftId ? { ...n, likes: Math.max(0, n.likes + (nextState ? 1 : -1)) } : n
          )
        }));

        return { status: 200, summary: 'Favorito ' + nftId + ': ' + nextState, data: true };
      });
    } catch (err) {
      recordLog('REST', 'POST', '/api/favorites/' + nftId, 503, 'Rollback de mutação otimista');
      notify('Falha na Mutação', err.message, 'error');
    } finally {
      setOptimisticFavorites((prev) => {
        const copy = { ...prev };
        delete copy[nftId];
        return copy;
      });
    }
  };

  const completeLogin = (user) => {
    setDb((prev) => {
      const visitorCart = prev.cartsByUser.guest || [];
      const accountCart = prev.cartsByUser[user.id] || [];
      const merged = new Map();

      accountCart.forEach((item) => merged.set(item.nftId, item.quantity));
      visitorCart.forEach((item) => {
        const nft = prev.nfts.find((n) => n.id === item.nftId);
        const limit = nft ? nft.availableEditions : item.quantity;
        const existingQty = merged.get(item.nftId) || 0;
        const combined = Math.min(limit, existingQty + item.quantity);
        if (combined > 0) merged.set(item.nftId, combined);
      });

      const mergedList = Array.from(merged.entries()).map(([nftId, quantity]) => ({
        nftId,
        quantity
      }));

      return {
        ...prev,
        cartsByUser: {
          ...prev.cartsByUser,
          guest: [],
          [user.id]: mergedList
        },
        couponsByUser: {
          ...prev.couponsByUser,
          guest: null,
          [user.id]: prev.couponsByUser[user.id] || prev.couponsByUser.guest || null
        }
      };
    });

    setCurrentUserId(user.id);
    try {
      localStorage.setItem('nft_session_uid', user.id);
    } catch (e) {}
    setSessionExpiredAlert(false);
    notify('Olá, ' + user.name, 'Sessão autenticada e carrinho sincronizado.', 'success');

    if (pendingRedirectRoute) {
      const target = pendingRedirectRoute;
      setPendingRedirectRoute(null);
      navigate(target.path, target.params, target.search);
    } else {
      navigate('/');
    }
  };

  const logout = async () => {
    await requestApi(
      'POST',
      '/api/auth/logout',
      () => ({ status: 200, summary: 'Logout concluído e cache limpo', data: true }),
      { skipAuthCheck: true }
    );
    setCurrentUserId(null);
    setOptimisticFavorites({});
    setCartSocketNotices({});
    try {
      localStorage.removeItem('nft_session_uid');
    } catch (e) {}
    notify('Sessão Encerrada', 'Dados privados da sessão anterior foram removidos.', 'info');
    navigate('/');
  };

  const resetMockScenario = () => {
    try {
      localStorage.removeItem(DB_STORAGE_KEY);
      localStorage.removeItem('nft_session_uid');
    } catch (e) {}
    const initial = {
      nfts: JSON.parse(JSON.stringify(SEED_NFTS)),
      users: JSON.parse(JSON.stringify(SEED_USERS)),
      cartsByUser: {
        guest: [{ nftId: 'nft-1', quantity: 1 }],
        'user-1': [{ nftId: 'nft-2', quantity: 1 }],
        'user-2': []
      },
      couponsByUser: { guest: null, 'user-1': null, 'user-2': null },
      orders: [],
      idempotencyRegistry: {}
    };
    setDb(initial);
    setCurrentUserId(null);
    setCartSocketNotices({});
    setQuoteRequiresRevalidation(false);
    setFaultMode('NONE');
    setLatencyMs(180);
    setSocketOnline(true);
    seenSocketVersions.current = {};
    recordLog('REST', 'POST', '/api/mocks/reset', 200, 'Fixtures restauradas ao estado inicial');
    notify('Mocks Restaurados', 'Banco em memória e carrinhos voltaram para a fixture padrão.', 'info');
    navigate('/', {}, {
      q: '',
      category: 'Todos',
      status: 'Todos',
      network: 'Todas',
      minEth: '',
      maxEth: '',
      sort: 'popular',
      page: 1
    });
  };

  const CatalogView = () => {
    const [searchText, setSearchText] = useState(route.search.q);

    useEffect(() => {
      setSearchText(route.search.q);
    }, [route.search.q]);

    useEffect(() => {
      const id = setTimeout(() => {
        if (searchText !== route.search.q) {
          updateFilters({ q: searchText });
        }
      }, 300);
      return () => clearTimeout(id);
    }, [searchText]);

    const highlight = useMemo(
      () => db.nfts.find((item) => item.id === 'nft-1') || db.nfts[0],
      [db.nfts]
    );

    const matchingNfts = useMemo(() => {
      const { q, category, status, network, minEth, maxEth, sort } = route.search;
      return db.nfts
        .filter((nft) => {
          if (q) {
            const term = q.toLowerCase();
            const match =
              nft.title.toLowerCase().includes(term) ||
              nft.creator.toLowerCase().includes(term) ||
              nft.collection.toLowerCase().includes(term);
            if (!match) return false;
          }
          if (category !== 'Todos' && nft.category !== category) return false;
          if (network !== 'Todas' && nft.network !== network) return false;
          if (status === 'Disponível' && nft.availableEditions <= 0) return false;
          if (
            status === 'Últimas Edições' &&
            (nft.availableEditions <= 0 || nft.availableEditions > 3)
          )
            return false;
          if (status === 'Esgotado' && nft.availableEditions > 0) return false;
          if (minEth && compareEthValues(nft.priceEth, minEth) < 0) return false;
          if (maxEth && compareEthValues(nft.priceEth, maxEth) > 0) return false;
          return true;
        })
        .sort((a, b) => {
          if (sort === 'price_asc') return compareEthValues(a.priceEth, b.priceEth);
          if (sort === 'price_desc') return compareEthValues(b.priceEth, a.priceEth);
          if (sort === 'recent')
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          return b.likes - a.likes;
        });
    }, [db.nfts, route.search]);

    const pageSize = 6;
    const totalPages = Math.max(1, Math.ceil(matchingNfts.length / pageSize));
    const activePage = Math.min(route.search.page || 1, totalPages);
    const pageItems = useMemo(() => {
      const offset = (activePage - 1) * pageSize;
      return matchingNfts.slice(offset, offset + pageSize);
    }, [matchingNfts, activePage]);

    return (
      <div className="space-y-8">
        {highlight && (
          <section
            aria-label="Destaque Principal"
            className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#12141D] via-[#131624] to-[#1A1433] p-5 sm:p-8 overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Destaque da Curadoria</span>
                  <span className="font-mono text-[11px] text-cyan-300">v{highlight.version}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  {highlight.title}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
                  {highlight.description}
                </p>

                <div className="flex flex-wrap items-center gap-5 pt-1">
                  <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                      Preço Atual
                    </span>
                    <span className="font-mono text-xl font-bold text-white tabular-nums">
                      {highlight.priceEth} ETH
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      ≈ {formatBrl(highlight.priceEth)}
                    </span>
                  </div>

                  <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                      Edições Disponíveis
                    </span>
                    <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">
                      {highlight.availableEditions} / {highlight.totalEditions}
                    </span>
                    <span className="text-xs text-slate-400 block">Rede {highlight.network}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate('/nft/:id', { id: highlight.id })}
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition flex items-center gap-2"
                  >
                    <span>Ver Detalhes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addToCart(highlight, 1, true)}
                    disabled={highlight.availableEditions === 0}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-medium text-sm border border-white/10 transition flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>
                      {highlight.availableEditions === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                    </span>
                  </button>
                  <button
                    onClick={() => navigate('/nft/:id', { id: 'token-inexistente-404' })}
                    className="px-3.5 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs border border-dashed border-white/15 transition"
                  >
                    Simular Acesso 404
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div
                  onClick={() => navigate('/nft/:id', { id: highlight.id })}
                  className="w-full max-w-xs aspect-square rounded-2xl overflow-hidden border border-white/15 shadow-2xl cursor-pointer group relative"
                >
                  <TokenArtwork
                    item={highlight}
                    className="w-full h-full group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-300 font-medium">{highlight.collection}</p>
                      <p className="text-[11px] text-cyan-400 font-mono">{highlight.creator}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-violet-500/20 text-violet-200 font-mono text-xs border border-violet-500/30">
                      {highlight.tokenStandard}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section
          aria-label="Filtros do Catálogo"
          className="rounded-2xl border border-white/10 bg-[#12141D] p-4 sm:p-5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4 relative">
              <label htmlFor="search-input" className="sr-only">
                Buscar NFT
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-input"
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Buscar por título, coleção ou @criador..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="category-select" className="sr-only">
                Categoria
              </label>
              <select
                id="category-select"
                value={route.search.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-slate-200"
              >
                <option value="Todos">Todas Categorias</option>
                <option value="Arte Digital">Arte Digital</option>
                <option value="Generativo">Generativo</option>
                <option value="Fotografia 3D">Fotografia 3D</option>
                <option value="Colecionáveis">Colecionáveis</option>
                <option value="Música & Áudio">Música & Áudio</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="status-select" className="sr-only">
                Disponibilidade
              </label>
              <select
                id="status-select"
                value={route.search.status}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-slate-200"
              >
                <option value="Todos">Qualquer Status</option>
                <option value="Disponível">Disponível</option>
                <option value="Últimas Edições">Últimas Edições (≤3)</option>
                <option value="Esgotado">Esgotado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="network-select" className="sr-only">
                Rede
              </label>
              <select
                id="network-select"
                value={route.search.network}
                onChange={(e) => updateFilters({ network: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-slate-200"
              >
                <option value="Todas">Todas as Redes</option>
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Arbitrum">Arbitrum</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="sort-select" className="sr-only">
                Ordenação
              </label>
              <select
                id="sort-select"
                value={route.search.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-slate-200"
              >
                <option value="popular">Mais Populares</option>
                <option value="recent">Mais Recentes</option>
                <option value="price_asc">Menor Preço (ETH)</option>
                <option value="price_desc">Maior Preço (ETH)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Intervalo (ETH):</span>
              <input
                type="text"
                inputMode="decimal"
                aria-label="Preço mínimo em ETH"
                placeholder="Mín (0.50)"
                value={route.search.minEth}
                onChange={(e) => updateFilters({ minEth: e.target.value })}
                className="w-28 px-2.5 py-1.5 rounded-lg bg-[#090A0F] border border-white/10 font-mono text-xs text-white"
              />
              <span>até</span>
              <input
                type="text"
                inputMode="decimal"
                aria-label="Preço máximo em ETH"
                placeholder="Máx (2.50)"
                value={route.search.maxEth}
                onChange={(e) => updateFilters({ maxEth: e.target.value })}
                className="w-28 px-2.5 py-1.5 rounded-lg bg-[#090A0F] border border-white/10 font-mono text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Total: <strong className="text-white">{matchingNfts.length}</strong> itens
              </span>
              {(route.search.q ||
                route.search.category !== 'Todos' ||
                route.search.status !== 'Todos' ||
                route.search.network !== 'Todas' ||
                route.search.minEth ||
                route.search.maxEth) && (
                <button
                  onClick={() => {
                    setSearchText('');
                    updateFilters({
                      q: '',
                      category: 'Todos',
                      status: 'Todos',
                      network: 'Todas',
                      minEth: '',
                      maxEth: '',
                      page: 1
                    });
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 font-medium underline"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>
        </section>

        {catalogError && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-white">Erro ao carregar catálogo</h2>
                <p className="text-xs text-rose-200/80">{catalogError}</p>
              </div>
            </div>
            <button
              onClick={() => updateFilters({})}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tentar novamente</span>
            </button>
          </div>
        )}

        {catalogLoading ? (
          <div
            aria-busy="true"
            aria-label="Carregando lista de NFTs"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-[#12141D] overflow-hidden animate-pulse"
              >
                <div className="aspect-square w-full bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-1/3 bg-white/10 rounded" />
                  <div className="h-5 w-3/4 bg-white/10 rounded" />
                  <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                    <div className="h-8 w-24 bg-white/10 rounded-lg" />
                    <div className="h-9 w-28 bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#12141D] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-white">Nenhum resultado encontrado</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Ajuste os filtros combinados ou redefina a busca para visualizar todo o catálogo.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchText('');
                updateFilters({
                  q: '',
                  category: 'Todos',
                  status: 'Todos',
                  network: 'Todas',
                  minEth: '',
                  maxEth: '',
                  page: 1
                });
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Redefinir busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((nft) => {
              const isFav =
                optimisticFavorites[nft.id] !== undefined
                  ? optimisticFavorites[nft.id]
                  : (currentUser && currentUser.favorites.includes(nft.id)) || false;
              const soldOut = nft.availableEditions === 0;
              const scarce = nft.availableEditions > 0 && nft.availableEditions <= 2;

              return (
                <article
                  key={nft.id}
                  onClick={() => navigate('/nft/:id', { id: nft.id })}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate('/nft/:id', { id: nft.id });
                    }
                  }}
                  className="group rounded-2xl border border-white/10 hover:border-violet-500/50 bg-[#12141D] overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#090A0F]">
                    <TokenArtwork
                      item={nft}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span
                        className={
                          'px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md border ' +
                          (soldOut
                            ? 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                            : scarce
                            ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300')
                        }
                      >
                        {soldOut
                          ? 'Esgotado'
                          : scarce
                          ? 'Últimas ' + nft.availableEditions + ' ed.'
                          : nft.availableEditions + '/' + nft.totalEditions + ' disp.'}
                      </span>

                      <button
                        type="button"
                        aria-label={
                          isFav
                            ? 'Remover ' + nft.title + ' dos favoritos'
                            : 'Favoritar ' + nft.title
                        }
                        onClick={(e) => toggleFavorite(nft.id, e)}
                        className={
                          'px-2.5 py-1.5 rounded-full backdrop-blur-md border transition flex items-center gap-1.5 text-xs ' +
                          (isFav
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                            : 'bg-black/60 border-white/15 text-slate-300 hover:text-white')
                        }
                      >
                        <Heart className={'w-3.5 h-3.5 ' + (isFav ? 'fill-rose-400 text-rose-400' : '')} />
                        <span className="font-mono tabular-nums">{nft.likes}</span>
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span>{nft.network}</span>
                      <span className="text-slate-500">•</span>
                      <span>{nft.category}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="truncate">{nft.collection}</span>
                        <span className="font-mono text-cyan-400">{nft.creator}</span>
                      </div>
                      <h2 className="text-base font-bold text-white group-hover:text-violet-300 transition truncate">
                        {nft.title}
                      </h2>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                          Preço
                        </span>
                        <span className="font-mono text-base font-bold text-white tabular-nums">
                          {nft.priceEth} ETH
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={soldOut}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(nft, 1, true);
                        }}
                        className={
                          'px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ' +
                          (soldOut
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                            : 'bg-violet-600/20 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/30')
                        }
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{soldOut ? 'Indisponível' : 'Comprar'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Paginação"
            className="flex items-center justify-between pt-4 border-t border-white/10"
          >
            <span className="text-xs text-slate-400">
              Página <strong className="text-white">{activePage}</strong> de{' '}
              <strong className="text-white">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateFilters({ page: Math.max(1, activePage - 1) })}
                disabled={activePage <= 1}
                className="px-3 py-1.5 rounded-xl bg-[#12141D] border border-white/10 text-xs text-slate-200 disabled:opacity-40 hover:bg-white/5 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    onClick={() => updateFilters({ page: p })}
                    aria-current={p === activePage ? 'page' : undefined}
                    className={
                      'w-8 h-8 rounded-xl font-mono text-xs font-semibold transition ' +
                      (p === activePage
                        ? 'bg-violet-600 text-white'
                        : 'bg-[#12141D] border border-white/10 text-slate-400 hover:text-white')
                    }
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => updateFilters({ page: Math.min(totalPages, activePage + 1) })}
                disabled={activePage >= totalPages}
                className="px-3 py-1.5 rounded-xl bg-[#12141D] border border-white/10 text-xs text-slate-200 disabled:opacity-40 hover:bg-white/5 flex items-center gap-1"
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    );
  };

  const DetailView = () => {
    const nftId = route.params.id;
    const nft = db.nfts.find((item) => item.id === nftId);
    const [qty, setQty] = useState(1);

    const inCartQty = useMemo(() => {
      const entry = (db.cartsByUser[cartOwnerKey] || []).find((i) => i.nftId === nftId);
      return entry ? entry.quantity : 0;
    }, [db.cartsByUser, cartOwnerKey, nftId]);

    if (!nft) {
      return (
        <div
          role="alert"
          className="rounded-2xl border border-white/10 bg-[#12141D] p-12 text-center max-w-xl mx-auto my-8 space-y-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-rose-400">
              Erro 404 • Recurso Inexistente
            </span>
            <h1 className="text-2xl font-bold text-white">NFT não encontrado</h1>
            <p className="text-sm text-slate-400">
              O identificador <code className="font-mono text-rose-300">{nftId}</code> não existe no
              catálogo.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>
      );
    }

    const availableToAdd = Math.max(0, nft.availableEditions - inCartQty);
    const isFav =
      optimisticFavorites[nft.id] !== undefined
        ? optimisticFavorites[nft.id]
        : (currentUser && currentUser.favorites.includes(nft.id)) || false;

    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o catálogo</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/15 bg-[#12141D] shadow-2xl relative">
              <TokenArtwork item={nft} className="w-full h-full" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono text-cyan-300">
                v{nft.version}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12141D] p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Atributos da Edição
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {nft.attributes.map((attr, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-[#090A0F] p-3 space-y-1"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-violet-400 block">
                      {attr.trait}
                    </span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {attr.value}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {attr.rarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#12141D] p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-medium">
                    {nft.collection}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    {nft.network}
                  </span>
                </div>

                <button
                  onClick={(e) => toggleFavorite(nft.id, e)}
                  className={
                    'px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition ' +
                    (isFav
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white')
                  }
                >
                  <Heart className={'w-4 h-4 ' + (isFav ? 'fill-rose-400 text-rose-400' : '')} />
                  <span>{isFav ? 'Favoritado' : 'Favoritar'}</span>
                  <span className="font-mono">({nft.likes})</span>
                </button>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{nft.title}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Criador <strong className="text-cyan-400 font-mono">{nft.creator}</strong> •
                  Contrato <code className="font-mono text-slate-300">{nft.contractAddress}</code> (
                  {nft.tokenStandard})
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{nft.description}</p>

              <div className="rounded-2xl border border-white/10 bg-[#090A0F] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Preço Unitário</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                    {nft.priceEth} ETH
                  </span>
                  <span className="text-xs text-slate-400 font-mono block mt-0.5">
                    ≈ {formatBrl(nft.priceEth)}
                  </span>
                </div>

                <div className="sm:border-l sm:border-white/10 sm:pl-4 flex flex-col justify-center">
                  <span className="text-xs text-slate-400 block">Disponibilidade</span>
                  <span
                    className={
                      'font-mono text-lg font-bold ' +
                      (nft.availableEditions === 0
                        ? 'text-rose-400'
                        : nft.availableEditions <= 2
                        ? 'text-amber-400'
                        : 'text-emerald-400')
                    }
                  >
                    {nft.availableEditions === 0
                      ? 'Edição Esgotada'
                      : nft.availableEditions + ' de ' + nft.totalEditions + ' disponíveis'}
                  </span>
                  {inCartQty > 0 && (
                    <span className="text-[11px] text-violet-300 mt-0.5">
                      ({inCartQty} já no seu carrinho)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-300">Quantidade:</span>
                    <div className="inline-flex items-center rounded-xl border border-white/15 bg-[#090A0F]">
                      <button
                        type="button"
                        aria-label="Reduzir quantidade"
                        disabled={qty <= 1 || availableToAdd === 0}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="p-2.5 text-slate-300 hover:text-white disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-mono text-sm font-bold text-white tabular-nums">
                        {availableToAdd === 0 ? 0 : qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Aumentar quantidade"
                        disabled={qty >= availableToAdd}
                        onClick={() => setQty((q) => Math.min(availableToAdd, q + 1))}
                        className="p-2.5 text-slate-300 hover:text-white disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      Subtotal: {multiplyEth(nft.priceEth, availableToAdd === 0 ? 0 : qty)} ETH
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={availableToAdd === 0}
                    onClick={() => addToCart(nft, qty, true)}
                    className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-white font-semibold text-sm border border-white/15 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-cyan-400" />
                    <span>
                      {nft.availableEditions === 0
                        ? 'Indisponível'
                        : availableToAdd === 0
                        ? 'Limite no Carrinho'
                        : 'Adicionar ao Carrinho'}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={nft.availableEditions === 0}
                    onClick={async () => {
                      if (availableToAdd > 0) {
                        await addToCart(nft, qty, false);
                      }
                      setCartDrawerOpen(false);
                      if (!currentUser) {
                        setPendingRedirectRoute({
                          path: '/checkout',
                          params: {},
                          search: route.search
                        });
                        notify('Autenticação Necessária', 'Entre para concluir a compra.', 'info');
                        navigate('/login');
                      } else {
                        navigate('/checkout');
                      }
                    }}
                    className="py-3 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Comprar Agora</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Histórico de Preço
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {nft.priceHistory.map((entry, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-[#090A0F] border border-white/5 p-2.5 text-center"
                    >
                      <span className="text-[11px] text-slate-400 block">{entry.date}</span>
                      <span className="font-mono text-xs font-bold text-white">
                        {entry.priceEth} ETH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [checkoutForm, setCheckoutForm] = useState({
    fullName: (currentUser && currentUser.name) || '',
    email: (currentUser && currentUser.email) || '',
    document: (currentUser && currentUser.document) || '',
    walletId: (currentUser && currentUser.wallets && currentUser.wallets[0] && currentUser.wallets[0].id) || '',
    walletState: 'CONNECTED',
    acceptedTerms: true
  });

  useEffect(() => {
    if (currentUser) {
      const mainWallet =
        currentUser.wallets.find((w) => w.isPrimary) || currentUser.wallets[0];
      setCheckoutForm((prev) => ({
        ...prev,
        fullName: currentUser.name,
        email: currentUser.email,
        document: currentUser.document || '128.459.021-90',
        walletId: mainWallet ? mainWallet.id : ''
      }));
    }
  }, [currentUser]);

  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [idempotencyKey, setIdempotencyKey] = useState(
    () => 'idem_' + Date.now().toString(36) + '_v1'
  );
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSubmitError, setOrderSubmitError] = useState(null);

  const submitOrder = async (simulateConflict = false) => {
    setOrderSubmitError(null);

    const validation = {};
    if (!checkoutForm.fullName.trim()) validation.fullName = 'Nome obrigatório.';
    if (!checkoutForm.email.includes('@')) validation.email = 'E-mail inválido.';
    if (!checkoutForm.document.trim()) validation.document = 'Documento obrigatório.';
    if (!checkoutForm.walletId) validation.wallet = 'Selecione uma carteira.';
    if (!checkoutForm.acceptedTerms) validation.terms = 'Confirme os termos do pedido.';

    if (Object.keys(validation).length > 0) {
      setCheckoutErrors(validation);
      return;
    }
    setCheckoutErrors({});

    if (checkoutForm.walletState === 'DISCONNECTED') {
      setOrderSubmitError('Carteira desconectada. Reconecte antes de enviar.');
      return;
    }
    if (checkoutForm.walletState === 'REJECTED') {
      setOrderSubmitError('Assinatura recusada na carteira pelo usuário.');
      return;
    }
    if (quoteRequiresRevalidation) {
      setOrderSubmitError(
        'Os preços ou disponibilidade mudaram em tempo real. Revalide o resumo antes de confirmar.'
      );
      return;
    }
    if (quoteSummary.hasStockConflict) {
      setOrderSubmitError('Há itens sem estoque suficiente no carrinho.');
      return;
    }
    if (cartLines.length === 0) {
      setOrderSubmitError('Carrinho vazio.');
      return;
    }

    setSubmittingOrder(true);

    const payloadFingerprint = simulateConflict
      ? 'CONFLICT_PAYLOAD_HASH'
      : JSON.stringify({
          userId: currentUser.id,
          items: cartLines.map((i) => ({
            nftId: i.nftId,
            qty: i.quantity,
            priceEth: i.nft.priceEth
          })),
          totalEth: quoteSummary.totalEth
        });

    try {
      const result = await requestApi('POST', '/api/orders', () => {
        const record = dbRef.current.idempotencyRegistry[idempotencyKey];

        if (record) {
          if (record.payloadFingerprint !== payloadFingerprint) {
            const conflict = new Error(
              'Conflito de Idempotência (HTTP 409): chave "' + idempotencyKey + '" reutilizada com parâmetros diferentes.'
            );
            conflict.status = 409;
            throw conflict;
          }

          const existingOrder = dbRef.current.orders.find((o) => o.id === record.orderId);
          if (existingOrder) {
            return {
              status: 200,
              summary: 'Pedido ' + existingOrder.id + ' recuperado por idempotência',
              data: { order: existingOrder, recovered: true }
            };
          }
        }

        const chosenWallet = currentUser.wallets.find((w) => w.id === checkoutForm.walletId);
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const createdOrder = {
          id: orderId,
          userId: currentUser.id,
          idempotencyKey,
          status: 'PENDING',
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          collector: {
            fullName: checkoutForm.fullName,
            email: checkoutForm.email,
            document: checkoutForm.document
          },
          wallet: chosenWallet || {
            label: 'Carteira Principal',
            address: '0x71C...89A2',
            network: selectedNetwork
          },
          network: selectedNetwork,
          txHash:
            '0x' +
            Math.random().toString(16).slice(2, 10) +
            '...' +
            Math.random().toString(16).slice(2, 6),
          items: cartLines.map((item) => ({
            nftId: item.nft.id,
            title: item.nft.title,
            collection: item.nft.collection,
            creator: item.nft.creator,
            quantity: item.quantity,
            unitPriceEth: item.nft.priceEth,
            lineTotalEth: item.lineTotalEth
          })),
          quoteSnapshot: {
            subtotalEth: quoteSummary.subtotalEth,
            discountEth: quoteSummary.discountEth,
            couponCode: (appliedCoupon && appliedCoupon.code) || null,
            networkFeeEth: quoteSummary.networkFeeEth,
            totalEth: quoteSummary.totalEth,
            totalBrl: quoteSummary.totalBrl
          }
        };

        setDb((prev) => ({
          ...prev,
          orders: [createdOrder, ...prev.orders],
          idempotencyRegistry: {
            ...prev.idempotencyRegistry,
            [idempotencyKey]: {
              payloadFingerprint,
              orderId
            }
          }
        }));

        if (faultMode === 'ORDER_TIMEOUT') {
          setFaultMode('NONE');
          const timeoutErr = new Error(
            'Timeout de requisição (504). Reenvie para recuperar o mesmo pedido via chave de idempotência.'
          );
          timeoutErr.status = 504;
          throw timeoutErr;
        }

        return {
          status: 201,
          summary: 'Pedido ' + orderId + ' criado',
          data: { order: createdOrder, recovered: false }
        };
      });

      if (result.recovered) {
        notify(
          'Pedido Recuperado',
          'Transação ' + result.order.id + ' recuperada sem duplicidade via Idempotency-Key.',
          'info'
        );
      } else {
        notify('Pedido Criado', 'Pedido ' + result.order.id + ' aguardando confirmação.', 'info');
      }

      navigate('/order/:id', { id: result.order.id });
    } catch (err) {
      recordLog('REST', 'POST', '/api/orders', err.status || 500, err.message);
      setOrderSubmitError(err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const CheckoutView = () => {
    if (!currentUser) {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#12141D] p-10 text-center max-w-lg mx-auto space-y-4">
          <Lock className="w-8 h-8 text-violet-400 mx-auto" />
          <h1 className="text-xl font-bold text-white">Autenticação Necessária</h1>
          <p className="text-sm text-slate-400">
            Acesse sua conta para revisar o pedido e assinar com sua carteira cadastrada.
          </p>
          <button
            onClick={() => {
              setPendingRedirectRoute(route);
              navigate('/login');
            }}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold"
          >
            Fazer Login
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Checkout</h1>
            <p className="text-xs text-slate-400">
              Revalidação automática de cotação e proteção contra envio duplicado.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-cyan-300">
            Idempotency-Key: {idempotencyKey}
          </span>
        </div>

        {quoteRequiresRevalidation && (
          <div
            role="alert"
            aria-live="assertive"
            className="rounded-2xl border border-amber-500/50 bg-amber-950/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-amber-200">
                  Cotação Atualizada via Socket.IO
                </h2>
                <p className="text-xs text-amber-100/80">
                  O preço ou a disponibilidade de um item do carrinho sofreu alteração. Confirme os
                  novos valores para liberar o envio.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setQuoteRequiresRevalidation(false);
                setCartSocketNotices({});
                setIdempotencyKey('idem_' + Date.now().toString(36) + '_v2');
                notify('Cotação Revalidada', 'Resumo atualizado confirmado.', 'success');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shrink-0"
            >
              Confirmar Novos Valores
            </button>
          </div>
        )}

        {orderSubmitError && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-500/50 bg-rose-950/30 p-4 flex items-center gap-3 text-xs text-rose-200"
          >
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{orderSubmitError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-violet-400" />
                <span>Dados do Colecionador</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="c-name" className="block text-xs font-medium text-slate-300 mb-1">
                    Nome Completo
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    value={checkoutForm.fullName}
                    onChange={(e) => setCheckoutForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
                  />
                  {checkoutErrors.fullName && (
                    <p className="text-xs text-rose-400 mt-1">{checkoutErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="c-email"
                    className="block text-xs font-medium text-slate-300 mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="c-email"
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
                  />
                  {checkoutErrors.email && (
                    <p className="text-xs text-rose-400 mt-1">{checkoutErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="c-doc" className="block text-xs font-medium text-slate-300 mb-1">
                  CPF / Identificador Fiscal
                </label>
                <input
                  id="c-doc"
                  type="text"
                  value={checkoutForm.document}
                  onChange={(e) => setCheckoutForm((p) => ({ ...p, document: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white font-mono"
                />
                {checkoutErrors.document && (
                  <p className="text-xs text-rose-400 mt-1">{checkoutErrors.document}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>Carteira e Rede</span>
                </h2>
                <button
                  type="button"
                  onClick={() => navigate('/wallets')}
                  className="text-xs text-violet-400 hover:text-violet-300 underline"
                >
                  Editar carteiras
                </button>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300 mb-2">
                  Rede Blockchain
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {['Ethereum', 'Polygon', 'Arbitrum'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setSelectedNetwork(net)}
                      className={
                        'p-3 rounded-xl border text-left transition ' +
                        (selectedNetwork === net
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-[#090A0F] border-white/10 text-slate-400 hover:text-white')
                      }
                    >
                      <span className="text-xs font-bold block">{net}</span>
                      <span className="font-mono text-[11px] text-cyan-300">
                        Taxa: {GAS_FEES[net]} ETH
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-medium text-slate-300">
                  Carteira Cadastrada
                </span>
                {currentUser.wallets.map((w) => (
                  <label
                    key={w.id}
                    className={
                      'flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ' +
                      (checkoutForm.walletId === w.id
                        ? 'bg-violet-600/15 border-violet-500'
                        : 'bg-[#090A0F] border-white/10 hover:border-white/20')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="walletId"
                        checked={checkoutForm.walletId === w.id}
                        onChange={() => setCheckoutForm((p) => ({ ...p, walletId: w.id }))}
                        className="accent-violet-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{w.label}</span>
                          {w.isPrimary && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                              Principal
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs text-slate-400">{w.address}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">{w.network}</span>
                  </label>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Estado da Carteira (Simulação)
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'CONNECTED', label: 'Conectada' },
                    { id: 'REJECTED', label: 'Recusar Assinatura' },
                    { id: 'DISCONNECTED', label: 'Desconectada' }
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setCheckoutForm((p) => ({ ...p, walletState: st.id }))}
                      className={
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition ' +
                        (checkoutForm.walletState === st.id
                          ? 'bg-violet-600 text-white border-violet-400'
                          : 'bg-[#090A0F] text-slate-400 border-white/10 hover:text-white')
                      }
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-5">
              <h2 className="text-base font-bold text-white">Resumo do Pedido</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartLines.map((item) => (
                  <div
                    key={item.nftId}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#090A0F] border border-white/10"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <TokenArtwork item={item.nft} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.nft.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {item.quantity} × {item.nft.priceEth} ETH
                        </p>
                        {item.outOfStock && (
                          <span className="text-[11px] text-rose-400 font-semibold block">
                            Estoque insuficiente ({item.nft.availableEditions} disp.)
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white shrink-0">
                      {item.lineTotalEth} ETH
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({quoteSummary.itemCount} itens)</span>
                  <span className="font-mono text-white">{quoteSummary.subtotalEth} ETH</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Cupom ({appliedCoupon.code})</span>
                    <span className="font-mono">-{quoteSummary.discountEth} ETH</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Taxa de Rede ({selectedNetwork})</span>
                  <span className="font-mono text-cyan-300">+{quoteSummary.networkFeeEth} ETH</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <div className="text-right">
                    <span className="font-mono block">{quoteSummary.totalEth} ETH</span>
                    <span className="text-[11px] font-mono text-slate-400 font-normal">
                      ≈ {quoteSummary.totalBrl}
                    </span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checkoutForm.acceptedTerms}
                  onChange={(e) =>
                    setCheckoutForm((p) => ({ ...p, acceptedTerms: e.target.checked }))
                  }
                  className="mt-0.5 accent-violet-500"
                />
                <span>
                  Confirmo os dados de revisão e envio do pedido na rede {selectedNetwork}.
                </span>
              </label>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={
                    submittingOrder || quoteRequiresRevalidation || cartLines.length === 0
                  }
                  onClick={() => submitOrder(false)}
                  className="w-full py-3.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  {submittingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Enviando pedido...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirmar Compra</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => submitOrder(true)}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] border border-dashed border-white/15 transition"
                >
                  Simular Conflito de Idempotência (HTTP 409)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderReceiptView = () => {
    const orderId = route.params.id;
    const order = db.orders.find((o) => o.id === orderId);

    if (!order) {
      return (
        <div className="rounded-2xl border border-white/10 bg-[#12141D] p-10 text-center max-w-lg mx-auto space-y-4">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h1 className="text-xl font-bold text-white">Pedido inexistente</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Voltar ao Início
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div
          role="status"
          aria-live="polite"
          className={
            'rounded-2xl border p-6 ' +
            (order.status === 'CONFIRMED'
              ? 'border-emerald-500/40 bg-emerald-950/25'
              : order.status === 'DECLINED'
              ? 'border-rose-500/40 bg-rose-950/25'
              : 'border-amber-500/40 bg-amber-950/25')
          }
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {order.status === 'CONFIRMED' && (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {order.status === 'DECLINED' && (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
              )}
              {order.status === 'PENDING' && (
                <Clock className="w-8 h-8 text-amber-400 animate-pulse shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider px-2.5 py-0.5 rounded bg-black/40 border border-white/10 text-white">
                    {order.status === 'CONFIRMED'
                      ? 'CONFIRMADO'
                      : order.status === 'DECLINED'
                      ? 'RECUSADO'
                      : 'PENDENTE'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">v{order.version}</span>
                </div>
                <h1 className="text-xl font-bold text-white">
                  {order.status === 'CONFIRMED'
                    ? 'Confirmação do Pedido e Recibo'
                    : order.status === 'DECLINED'
                    ? 'Pedido Recusado'
                    : 'Aguardando Confirmação da Transação'}
                </h1>
                <p className="text-xs text-slate-300">
                  {order.status === 'CONFIRMED'
                    ? 'Snapshot imutável registrado. Alterações futuras no catálogo não alteram este recibo.'
                    : order.status === 'DECLINED'
                    ? 'Os itens foram mantidos no seu carrinho para nova tentativa.'
                    : 'Simule o retorno assíncrono do evento order.updated via Socket.IO nos botões ao lado.'}
                </p>
              </div>
            </div>

            {order.status === 'PENDING' && (
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() =>
                    dispatchSocketEvent('order.updated', {
                      id: order.id,
                      status: 'CONFIRMED',
                      version: order.version + 1,
                      txHash: '0x99f8a1...e42b'
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmar Pedido (Socket.IO)</span>
                </button>
                <button
                  onClick={() =>
                    dispatchSocketEvent('order.updated', {
                      id: order.id,
                      status: 'DECLINED',
                      version: order.version + 1,
                      failureReason: 'Pagamento recusado na simulação'
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Recusar Pedido (Socket.IO)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12141D] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs text-slate-400 block">Pedido</span>
              <span className="font-mono text-lg font-bold text-white">{order.id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Chave de Idempotência</span>
              <span className="font-mono text-xs text-cyan-300">{order.idempotencyKey}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Hash da Transação</span>
              <span className="font-mono text-xs text-violet-300 inline-flex items-center gap-1">
                {order.txHash}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl bg-[#090A0F] border border-white/10 p-4 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                Colecionador
              </span>
              <p className="text-sm font-bold text-white">{order.collector.fullName}</p>
              <p className="text-slate-400">{order.collector.email}</p>
              <p className="font-mono text-slate-400">{order.collector.document}</p>
            </div>
            <div className="rounded-xl bg-[#090A0F] border border-white/10 p-4 space-y-1">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                Carteira e Rede
              </span>
              <p className="text-sm font-bold text-white">{order.wallet.label}</p>
              <p className="font-mono text-slate-400 truncate">{order.wallet.address}</p>
              <p className="font-mono text-cyan-400">{order.network}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Itens do Pedido (Snapshot)
            </h2>
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#090A0F] border border-white/10"
              >
                <div>
                  <p className="text-sm font-bold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {item.collection} • {item.quantity}x @ {item.unitPriceEth} ETH
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-white">
                  {item.lineTotalEth} ETH
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">{order.quoteSnapshot.subtotalEth} ETH</span>
            </div>
            {order.quoteSnapshot.couponCode && (
              <div className="flex justify-between text-emerald-400">
                <span>Desconto ({order.quoteSnapshot.couponCode})</span>
                <span className="font-mono">-{order.quoteSnapshot.discountEth} ETH</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Taxa de Rede ({order.network})</span>
              <span className="font-mono text-cyan-300">
                +{order.quoteSnapshot.networkFeeEth} ETH
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
              <span>Total</span>
              <div className="text-right">
                <span className="font-mono block">{order.quoteSnapshot.totalEth} ETH</span>
                <span className="font-mono text-xs text-slate-400 font-normal">
                  {order.quoteSnapshot.totalBrl}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
            >
              Voltar ao Catálogo
            </button>
            {order.status === 'DECLINED' && (
              <button
                onClick={() => {
                  setIdempotencyKey('idem_' + Date.now().toString(36) + '_retry');
                  navigate('/checkout');
                }}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Tentar Novamente no Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LoginView = () => {
    const [email, setEmail] = useState('colecionador@nft.io');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);
      try {
        const user = await requestApi(
          'POST',
          '/api/auth/login',
          () => {
            const match = dbRef.current.users.find(
              (u) => u.email.toLowerCase() === email.trim().toLowerCase()
            );
            if (!match || match.passwordHash !== 'sha256_' + password) {
              const err = new Error('E-mail ou senha inválidos.');
              err.status = 401;
              throw err;
            }
            return { status: 200, summary: 'Sessão iniciada (' + match.email + ')', data: match };
          },
          { skipAuthCheck: true }
        );
        completeLogin(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-md mx-auto my-6 rounded-2xl border border-white/10 bg-[#12141D] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Conecte-se</h1>
          <p className="text-xs text-slate-400">
            Itens adicionados como visitante são preservados ao entrar.
          </p>
        </div>

        <div className="rounded-xl bg-[#090A0F] border border-white/10 p-3.5 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
            Credenciais de Teste
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('colecionador@nft.io');
                setPassword('123456');
              }}
              className="p-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-left"
            >
              <span className="text-xs font-bold text-violet-200 block">Marina Silva</span>
              <span className="font-mono text-[10px] text-slate-400">colecionador@nft.io</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('whale@nft.io');
                setPassword('123456');
              }}
              className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-left"
            >
              <span className="text-xs font-bold text-cyan-200 block">Viktor Vance</span>
              <span className="font-mono text-[10px] text-slate-400">whale@nft.io</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2"
          >
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="l-email" className="block text-xs font-medium text-slate-300 mb-1">
              E-mail
            </label>
            <input
              id="l-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="l-pass" className="block text-xs font-medium text-slate-300 mb-1">
              Senha
            </label>
            <input
              id="l-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
          >
            {submitting ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-xs text-violet-400 hover:text-violet-300"
          >
            Criar nova conta de colecionador
          </button>
        </div>
      </div>
    );
  };

  const RegisterView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const onRegister = async (e) => {
      e.preventDefault();
      setError(null);
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      setSubmitting(true);
      try {
        const created = await requestApi('POST', '/api/auth/register', () => {
          const duplicate = dbRef.current.users.some(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
          );
          if (duplicate) {
            const err = new Error('Conflito (HTTP 409): o e-mail "' + email + '" já está cadastrado.');
            err.status = 409;
            throw err;
          }
          const user = {
            id: 'user-' + Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            passwordHash: 'sha256_' + password,
            handle: '@' + name.trim().toLowerCase().replace(/\s+/g, '.') + '.eth',
            bio: 'Colecionador Web3.',
            avatarColor: '#10B981',
            document: '000.000.000-00',
            favorites: [],
            wallets: [
              {
                id: 'wal-' + Date.now(),
                label: 'Carteira Principal',
                address: '0x88F1A2B3C4D5E6F7890123456789ABCDEF012345',
                network: 'Ethereum',
                isPrimary: true
              }
            ]
          };
          setDb((prev) => ({ ...prev, users: [...prev.users, user] }));
          return { status: 201, summary: 'Usuário ' + user.email + ' registrado', data: user };
        });
        completeLogin(created);
      } catch (err) {
        recordLog('REST', 'POST', '/api/auth/register', err.status || 400, err.message);
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="max-w-md mx-auto my-6 rounded-2xl border border-white/10 bg-[#12141D] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">Cadastro</h1>
          <p className="text-xs text-slate-400">
            Use <code className="text-violet-300">colecionador@nft.io</code> para testar conflito
            409.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label htmlFor="r-name" className="block text-xs font-medium text-slate-300 mb-1">
              Nome Completo
            </label>
            <input
              id="r-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="r-email" className="block text-xs font-medium text-slate-300 mb-1">
              E-mail
            </label>
            <input
              id="r-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
            />
          </div>
          <div>
            <label htmlFor="r-pass" className="block text-xs font-medium text-slate-300 mb-1">
              Senha
            </label>
            <input
              id="r-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition"
          >
            {submitting ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    );
  };

  const ProfileView = () => {
    if (!currentUser) return <LoginView />;
    const [name, setName] = useState(currentUser.name);
    const [handle, setHandle] = useState(currentUser.handle);
    const [bio, setBio] = useState(currentUser.bio);
    const [avatarColor, setAvatarColor] = useState(currentUser.avatarColor);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState(null);

    const saveProfile = async (e) => {
      e.preventDefault();
      if (!name.trim()) {
        notify('Erro', 'O nome não pode ficar em branco.', 'error');
        return;
      }
      await requestApi('PATCH', '/api/profile', () => {
        setDb((prev) => ({
          ...prev,
          users: prev.users.map((u) =>
            u.id === currentUser.id
              ? { ...u, name: name.trim(), handle: handle.trim(), bio, avatarColor }
              : u
          )
        }));
        return { status: 200, summary: 'Perfil atualizado', data: true };
      });
      notify('Perfil Salvo', 'Dados atualizados com sucesso.', 'success');
    };

    const updatePassword = async (e) => {
      e.preventDefault();
      setPasswordError(null);
      try {
        await requestApi('POST', '/api/profile/password', () => {
          if ('sha256_' + oldPassword !== currentUser.passwordHash) {
            const err = new Error('Senha atual incorreta.');
            err.status = 422;
            throw err;
          }
          if (newPassword.length < 6) {
            const err = new Error('A nova senha deve ter no mínimo 6 caracteres.');
            err.status = 422;
            throw err;
          }
          setDb((prev) => ({
            ...prev,
            users: prev.users.map((u) =>
              u.id === currentUser.id ? { ...u, passwordHash: 'sha256_' + newPassword } : u
            )
          }));
          return { status: 200, summary: 'Senha atualizada', data: true };
        });
        setOldPassword('');
        setNewPassword('');
        notify('Senha Atualizada', 'Credencial alterada com sucesso.', 'success');
      } catch (err) {
        setPasswordError(err.message);
      }
    };

    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-5">
          <h1 className="text-xl font-bold text-white">Perfil do Colecionador</h1>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: avatarColor }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
              >
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 block">Avatar</span>
                <div className="flex gap-2">
                  {['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      style={{ backgroundColor: color }}
                      className={
                        'w-6 h-6 rounded-full border-2 ' +
                        (avatarColor === color ? 'border-white scale-110' : 'border-transparent')
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="p-name" className="block text-xs font-medium text-slate-300 mb-1">
                Nome
              </label>
              <input
                id="p-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label htmlFor="p-handle" className="block text-xs font-medium text-slate-300 mb-1">
                Identificador ENS / Handle
              </label>
              <input
                id="p-handle"
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-cyan-300 font-mono"
              />
            </div>

            <div>
              <label htmlFor="p-bio" className="block text-xs font-medium text-slate-300 mb-1">
                Bio
              </label>
              <textarea
                id="p-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Salvar Alterações
            </button>
          </form>
        </div>

        <div className="md:col-span-5 rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-violet-400" />
            <span>Alterar Senha</span>
          </h2>
          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
              {passwordError}
            </div>
          )}
          <form onSubmit={updatePassword} className="space-y-4">
            <div>
              <label htmlFor="o-pass" className="block text-xs font-medium text-slate-300 mb-1">
                Senha Atual
              </label>
              <input
                id="o-pass"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="n-pass" className="block text-xs font-medium text-slate-300 mb-1">
                Nova Senha
              </label>
              <input
                id="n-pass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10"
            >
              Atualizar Senha
            </button>
          </form>
        </div>
      </div>
    );
  };

  const WalletsView = () => {
    if (!currentUser) return <LoginView />;
    const [label, setLabel] = useState('');
    const [address, setAddress] = useState('');
    const [network, setNetwork] = useState('Ethereum');
    const [isPrimary, setIsPrimary] = useState(false);
    const [error, setError] = useState(null);

    const addWallet = async (e) => {
      e.preventDefault();
      setError(null);
      if (!label.trim()) {
        setError('Informe um nome para a carteira.');
        return;
      }
      if (!/^0x[a-fA-F0-9]{10,40}$/.test(address.trim())) {
        setError('Endereço hexadecimal inválido (use formato 0x...).');
        return;
      }

      await requestApi('POST', '/api/wallets', () => {
        const created = {
          id: 'wal-' + Date.now(),
          label: label.trim(),
          address: address.trim(),
          network,
          isPrimary
        };
        setDb((prev) => ({
          ...prev,
          users: prev.users.map((u) => {
            if (u.id !== currentUser.id) return u;
            const list = isPrimary
              ? u.wallets.map((w) => ({ ...w, isPrimary: false }))
              : u.wallets;
            return { ...u, wallets: [...list, created] };
          })
        }));
        return { status: 201, summary: 'Carteira ' + created.label + ' cadastrada', data: created };
      });

      setLabel('');
      setAddress('');
      setIsPrimary(false);
      notify('Carteira Adicionada', 'Nova carteira disponível para checkout.', 'success');
    };

    const markPrimary = async (walletId) => {
      await requestApi('PATCH', '/api/wallets/' + walletId, () => {
        setDb((prev) => ({
          ...prev,
          users: prev.users.map((u) => {
            if (u.id !== currentUser.id) return u;
            return {
              ...u,
              wallets: u.wallets.map((w) => ({ ...w, isPrimary: w.id === walletId }))
            };
          })
        }));
        return { status: 200, summary: 'Carteira ' + walletId + ' definida como principal', data: true };
      });
      notify('Carteira Principal', 'Preferência atualizada.', 'info');
    };

    return (
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-4">
          <h1 className="text-xl font-bold text-white">Carteiras Cadastradas</h1>
          <div className="space-y-3">
            {currentUser.wallets.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-white/10 bg-[#12141D] p-5 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{w.label}</span>
                    <span
                      className={
                        'px-2 py-0.5 rounded text-[10px] font-semibold ' +
                        (w.isPrimary
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-400')
                      }
                    >
                      {w.isPrimary ? 'Principal' : 'Secundária'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono text-[10px]">
                      {w.network}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-slate-400 truncate">{w.address}</p>
                </div>
                {!w.isPrimary && (
                  <button
                    onClick={() => markPrimary(w.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-violet-300 border border-white/10 shrink-0"
                  >
                    Tornar Principal
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 rounded-2xl border border-white/10 bg-[#12141D] p-6 space-y-4 h-fit">
          <h2 className="text-base font-bold text-white">Nova Carteira</h2>
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
              {error}
            </div>
          )}
          <form onSubmit={addWallet} className="space-y-4">
            <div>
              <label htmlFor="w-label" className="block text-xs font-medium text-slate-300 mb-1">
                Identificação
              </label>
              <input
                id="w-label"
                type="text"
                placeholder="Ex: Hardware Wallet"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              />
            </div>
            <div>
              <label htmlFor="w-addr" className="block text-xs font-medium text-slate-300 mb-1">
                Endereço (0x...)
              </label>
              <input
                id="w-addr"
                type="text"
                placeholder="0x71C8F903A1B4D7E2..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label htmlFor="w-net" className="block text-xs font-medium text-slate-300 mb-1">
                Rede
              </label>
              <select
                id="w-net"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#090A0F] border border-white/10 text-sm text-white"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Arbitrum">Arbitrum</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="accent-violet-500"
              />
              <span>Definir como principal</span>
            </label>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Cadastrar Carteira
            </button>
          </form>
        </div>
      </div>
    );
  };

  const FavoritesView = () => {
    if (!currentUser) return <LoginView />;
    const items = db.nfts.filter((n) => currentUser.favorites.includes(n.id));
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Favoritos ({items.length})</h1>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#12141D] p-10 text-center space-y-3">
            <Heart className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400">Nenhum NFT favoritado.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
            >
              Ir para o Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((nft) => (
              <div
                key={nft.id}
                onClick={() => navigate('/nft/:id', { id: nft.id })}
                className="rounded-2xl border border-white/10 bg-[#12141D] overflow-hidden cursor-pointer hover:border-violet-500/40 transition"
              >
                <div className="aspect-square">
                  <TokenArtwork item={nft} />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">{nft.title}</h2>
                    <span className="font-mono text-xs text-cyan-400">{nft.priceEth} ETH</span>
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(nft.id, e)}
                    className="p-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const OrdersView = () => {
    if (!currentUser) return <LoginView />;
    const list = db.orders.filter((o) => o.userId === currentUser.id);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Pedidos ({list.length})</h1>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#12141D] p-10 text-center space-y-3">
            <FileText className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400">Você ainda não realizou pedidos.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate('/order/:id', { id: o.id })}
                className="rounded-2xl border border-white/10 bg-[#12141D] p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:border-violet-500/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{o.id}</span>
                    <span
                      className={
                        'px-2.5 py-0.5 rounded text-[11px] font-semibold ' +
                        (o.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : o.status === 'DECLINED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300')
                      }
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {o.items.length} item(ns) • {o.network}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-bold text-white block">
                    {o.quoteSnapshot.totalEth} ETH
                  </span>
                  <span className="text-xs text-violet-400 underline">Abrir Recibo →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const [simPanelOpen, setSimPanelOpen] = useState(false);

  const simulatePriceIncrease = () => {
    const target = (cartLines[0] && cartLines[0].nft) || db.nfts[0];
    dispatchSocketEvent('nft.updated', {
      id: target.id,
      priceEth: sumEth(target.priceEth, '0.2500'),
      availableEditions: target.availableEditions,
      version: target.version + 1
    });
  };

  const simulateSoldOut = () => {
    const target = (cartLines[0] && cartLines[0].nft) || db.nfts[0];
    dispatchSocketEvent('nft.updated', {
      id: target.id,
      priceEth: target.priceEth,
      availableEditions: 0,
      version: target.version + 1
    });
  };

  const simulateDuplicateEvent = () => {
    const target = (cartLines[0] && cartLines[0].nft) || db.nfts[0];
    dispatchSocketEvent('nft.updated', {
      id: target.id,
      priceEth: target.priceEth,
      availableEditions: target.availableEditions,
      version: target.version
    });
  };

  const simulateStaleEvent = () => {
    const target = (cartLines[0] && cartLines[0].nft) || db.nfts[0];
    dispatchSocketEvent('nft.updated', {
      id: target.id,
      priceEth: '0.1000',
      availableEditions: target.availableEditions,
      version: Math.max(0, target.version - 1)
    });
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      <div aria-live="polite" className="sr-only">
        {notifications[0] ? notifications[0].title + ': ' + notifications[0].message : ''}
      </div>

      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            role="status"
            className={
              'pointer-events-auto rounded-xl border p-3.5 shadow-2xl backdrop-blur-xl flex items-start gap-3 ' +
              (n.variant === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-100'
                : n.variant === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : n.variant === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : 'bg-[#181B26]/95 border-white/15 text-slate-100')
            }
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold">{n.title}</p>
              <p className="opacity-90">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090A0F]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block leading-none">
                  AETHER
                </span>
                <span className="font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
                  MARKETPLACE
                </span>
              </div>
            </button>

            <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
              {[
                { label: 'Explorar', path: '/' },
                { label: 'Favoritos', path: '/favorites' },
                { label: 'Pedidos', path: '/orders' },
                { label: 'Carteiras', path: '/wallets' },
                { label: 'Perfil', path: '/profile' }
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={
                    'px-3.5 py-2 rounded-xl text-xs font-medium transition ' +
                    (route.path === link.path
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5')
                  }
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSocketToggle}
              className={
                'hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition ' +
                (socketOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300')
              }
            >
              {socketOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Socket: ON</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Socket: OFF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              aria-label={'Carrinho com ' + quoteSummary.itemCount + ' itens'}
              className="relative px-3.5 py-2 rounded-xl bg-[#12141D] hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-violet-400" />
              <span className="font-mono">{quoteSummary.itemCount}</span>
              {Object.keys(cartSocketNotices).length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping absolute -top-1 -right-1" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-3 py-1.5 rounded-xl bg-[#12141D] hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs"
                >
                  <span
                    style={{ backgroundColor: currentUser.avatarColor }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {currentUser.name.slice(0, 1)}
                  </span>
                  <span className="hidden sm:inline font-medium text-white truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  aria-label="Sair"
                  className="p-2 rounded-xl bg-[#12141D] hover:bg-rose-500/20 border border-white/10 text-slate-400 hover:text-rose-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Conecte-se
              </button>
            )}
          </div>
        </div>

        <div className="bg-[#12141D]/90 border-t border-white/5 px-4 sm:px-6 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={navigateBack}
                  disabled={historyIdx <= 0}
                  aria-label="Voltar histórico"
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={navigateForward}
                  disabled={historyIdx >= historyStack.length - 1}
                  aria-label="Avançar histórico"
                  className="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-slate-500 font-mono">Rota:</span>
              <code className="font-mono text-cyan-300 bg-black/40 px-2 py-0.5 rounded border border-white/5 truncate">
                {urlPreview}
              </code>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 hidden sm:inline">
                Latência: <strong className="font-mono text-white">{latencyMs}ms</strong>
              </span>
              <button
                onClick={() => setSimPanelOpen((prev) => !prev)}
                className="text-violet-400 hover:text-violet-300 font-mono font-semibold flex items-center gap-1"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Painel MSW / Socket</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {sessionExpiredAlert && (
        <div
          role="alert"
          className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2.5 text-center text-xs text-amber-200"
        >
          Sessão expirada. Autentique-se para retomar o fluxo anterior (
          <code className="font-mono">{pendingRedirectRoute && pendingRedirectRoute.path}</code>).
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {route.path === '/' && <CatalogView />}
        {route.path === '/nft/:id' && <DetailView />}
        {route.path === '/checkout' && <CheckoutView />}
        {route.path === '/order/:id' && <OrderReceiptView />}
        {route.path === '/login' && <LoginView />}
        {route.path === '/register' && <RegisterView />}
        {route.path === '/profile' && <ProfileView />}
        {route.path === '/wallets' && <WalletsView />}
        {route.path === '/favorites' && <FavoritesView />}
        {route.path === '/orders' && <OrdersView />}
      </main>

      {cartDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Carrinho de Compras"
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-[#12141D] border-l border-white/10 h-full flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-bold text-white">Carrinho</h2>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 font-mono text-xs">
                    {quoteSummary.itemCount}
                  </span>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  aria-label="Fechar carrinho"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {Object.values(cartSocketNotices).map((notice) => (
                <div
                  key={notice.title}
                  role="alert"
                  className="rounded-xl border border-amber-500/50 bg-amber-950/30 p-3.5 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-amber-300">
                    <span>Evento Socket.IO (v{notice.version})</span>
                    <button
                      onClick={() =>
                        setCartSocketNotices((prev) => {
                          const copy = { ...prev };
                          const key = Object.keys(copy).find(
                            (k) => copy[k].title === notice.title
                          );
                          if (key) delete copy[key];
                          return copy;
                        })
                      }
                      className="text-[10px] underline"
                    >
                      OK
                    </button>
                  </div>
                  {notice.type === 'SOLD_OUT' ? (
                    <p className="text-amber-100">
                      <strong>{notice.title}</strong> esgotou. Remova para prosseguir.
                    </p>
                  ) : (
                    <p className="text-amber-100">
                      <strong>{notice.title}</strong> alterou de{' '}
                      <code className="font-mono line-through">{notice.oldPriceEth} ETH</code> para{' '}
                      <code className="font-mono font-bold">{notice.newPriceEth} ETH</code>.
                    </p>
                  )}
                </div>
              ))}

              {cartLines.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400">Carrinho vazio.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartLines.map((item) => (
                    <div
                      key={item.nftId}
                      className={
                        'p-3.5 rounded-xl border bg-[#090A0F] space-y-3 ' +
                        (item.outOfStock ? 'border-rose-500/60' : 'border-white/10')
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            <TokenArtwork item={item.nft} />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white">{item.nft.title}</h3>
                            <p className="font-mono text-xs text-cyan-400">
                              {item.nft.priceEth} ETH
                            </p>
                            <span className="text-[11px] text-slate-400">
                              Disponível: {item.nft.availableEditions} (v{item.nft.version})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeCartItem(item.nftId)}
                          aria-label={'Remover ' + item.nft.title}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="inline-flex items-center rounded-lg border border-white/10 bg-[#12141D]">
                          <button
                            onClick={() => changeCartQty(item.nftId, item.quantity - 1)}
                            aria-label="Diminuir"
                            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeCartQty(item.nftId, item.quantity + 1)}
                            disabled={item.quantity >= item.nft.availableEditions}
                            aria-label="Aumentar"
                            className="px-2.5 py-1 text-xs text-slate-300 hover:text-white disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-white">
                          {item.lineTotalEth} ETH
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cartLines.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Cupom</span>
                    <span className="font-mono text-[10px]">WEB3VIP | GENESIS20 | EXPIRED10</span>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                      <span className="font-mono font-bold">
                        {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)
                      </span>
                      <button onClick={removeCoupon} className="underline text-[11px]">
                        Remover
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={applyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código do cupom"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#090A0F] border border-white/10 text-xs text-white font-mono uppercase"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white"
                      >
                        Aplicar
                      </button>
                    </form>
                  )}
                  {couponValidationError && (
                    <p className="text-xs text-rose-400">{couponValidationError}</p>
                  )}
                </div>
              )}
            </div>

            {cartLines.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-4 mt-6">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">{quoteSummary.subtotalEth} ETH</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto</span>
                    <span className="font-mono">-{quoteSummary.discountEth} ETH</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxa de Rede ({selectedNetwork})</span>
                    <span className="font-mono text-cyan-300">+{quoteSummary.networkFeeEth} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <div className="text-right">
                      <span className="font-mono block">{quoteSummary.totalEth} ETH</span>
                      <span className="font-mono text-[11px] text-slate-400 font-normal">
                        ≈ {quoteSummary.totalBrl}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={quoteSummary.hasStockConflict}
                  onClick={() => {
                    setCartDrawerOpen(false);
                    if (!currentUser) {
                      setPendingRedirectRoute({
                        path: '/checkout',
                        params: {},
                        search: route.search
                      });
                      notify('Login Obrigatório', 'Autentique-se para continuar ao checkout.', 'info');
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold text-xs"
                >
                  {quoteSummary.hasStockConflict
                    ? 'Ajuste itens sem estoque'
                    : 'Ir para o Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40">
        {!simPanelOpen ? (
          <button
            onClick={() => setSimPanelOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#181B26] hover:bg-violet-950/90 border border-violet-500/40 text-xs font-mono text-white shadow-2xl flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Controles de Cenário (MSW / Socket)</span>
          </button>
        ) : (
          <aside
            aria-label="Configuração de Cenários de Rede"
            className="w-[92vw] sm:w-[440px] rounded-2xl border border-violet-500/40 bg-[#12141D]/95 backdrop-blur-xl shadow-2xl p-4 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 font-mono font-bold text-white">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Simulador de Rede e Eventos</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetMockScenario}
                  className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => setSimPanelOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                Disparo de Eventos Socket.IO
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={simulatePriceIncrease}
                  className="p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-left text-[11px] text-slate-200"
                >
                  Alterar Preço (+0.25 ETH)
                </button>
                <button
                  onClick={simulateSoldOut}
                  className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/20 border border-white/10 text-left text-[11px] text-slate-200"
                >
                  Esgotar Edição (0 disp.)
                </button>
                <button
                  onClick={simulateDuplicateEvent}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[11px] text-slate-300"
                >
                  Emitir Duplicata (mesma v)
                </button>
                <button
                  onClick={simulateStaleEvent}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[11px] text-slate-300"
                >
                  Emitir Evento Antigo (v-1)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 block">
                Condições de Rede MSW
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLatencyMs(180)}
                  className={
                    'flex-1 py-1.5 rounded-lg border text-[11px] ' +
                    (latencyMs === 180
                      ? 'bg-violet-600 text-white border-violet-400'
                      : 'bg-black/40 text-slate-400 border-white/10')
                  }
                >
                  Latência Padrão (180ms)
                </button>
                <button
                  onClick={() => setLatencyMs(1800)}
                  className={
                    'flex-1 py-1.5 rounded-lg border text-[11px] ' +
                    (latencyMs === 1800
                      ? 'bg-violet-600 text-white border-violet-400'
                      : 'bg-black/40 text-slate-400 border-white/10')
                  }
                >
                  Rede Lenta / Shimmer (1.8s)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { id: 'HTTP_500', label: 'Forçar Erro 500' },
                  { id: 'HTTP_401', label: 'Expirar Sessão (401)' },
                  { id: 'FAVORITE_FAIL', label: 'Falhar Favorito (Rollback)' },
                  { id: 'ORDER_TIMEOUT', label: 'Timeout no Pedido (504)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFaultMode((curr) => (curr === item.id ? 'NONE' : item.id))}
                    className={
                      'p-2 rounded-lg border text-left text-[11px] ' +
                      (faultMode === item.id
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-semibold'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:bg-white/5')
                    }
                  >
                    {faultMode === item.id ? '[Ativo] ' : ''}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Histórico de Chamadas
              </span>
              <div className="h-32 overflow-y-auto rounded-xl bg-[#090A0F] border border-white/10 p-2 font-mono text-[10px] space-y-1">
                {transportLogs.length === 0 ? (
                  <p className="text-slate-500">Sem tráfego registrado.</p>
                ) : (
                  transportLogs.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between gap-2 border-b border-white/5 pb-1"
                    >
                      <span
                        className={
                          entry.channel === 'SOCKET' ? 'text-cyan-400' : 'text-violet-400'
                        }
                      >
                        [{entry.channel}] {entry.operation}
                      </span>
                      <span className="text-slate-300 truncate flex-1">{entry.summary}</span>
                      <span className="text-slate-500">{entry.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}