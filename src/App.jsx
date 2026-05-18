import React, { useState, useEffect, useRef } from 'react';
// Importera Supabase-klienten
import { supabase } from './supabaseClient';

// Importera alla klockbilder
import tacticalImage from './assets/basalt-tactical-clean.png';
import ghostImage from './assets/basalt-ghost-transparent.png';
import commandoImage from './assets/basalt-commando-transparent.png';
import collectionImage from './assets/basalt-collection.png';

function App() {
  const [activeModel, setActiveModel] = useState('Tactical Edition');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [isHeritageOpen, setIsHeritageOpen] = useState(false);
  
  const [productData, setProductData] = useState({
    description: 'Laddar specifikationer...',
    price: '---'
  });
  const [loading, setLoading] = useState(true);

  const cartTimeoutRef = useRef(null);

  const modelImages = {
    'Tactical Edition': tacticalImage,
    'Ghost Ops': ghostImage,
    'Commando Steel': commandoImage
  };

  const maxStock = 3;
  const currentInCartCount = cart.filter(item => item.name === activeModel).length;
  const stockLeft = maxStock - currentInCartCount;

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('description, price')
        .eq('name', activeModel)
        .single();

      if (error) {
        console.error('Fel vid hämtning från Supabase:', error.message);
        setProductData({
          description: `Specifikationer för ${activeModel} laddas upp inom kort.`,
          price: 'Pris saknas'
        });
      } else if (data) {
        setProductData({
          description: data.description,
          price: data.price
        });
      }
      setLoading(false);
    }
    fetchProduct();
  }, [activeModel]);

  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    if (stockLeft <= 0) return;

    const itemToAdd = {
      id: crypto.randomUUID(),
      name: activeModel,
      price: productData.price,
      image: modelImages[activeModel]
    };
    
    setCart([...cart, itemToAdd]);
    setIsCartOpen(true);

    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }

    cartTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 3000);
  };

  const handleRemoveFromCart = (idToRemove) => {
    setCart(cart.filter(item => item.id !== idToRemove));
    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
  };

  const calculateTotal = () => {
    const numericTotal = cart.reduce((sum, item) => {
      const priceAsNumber = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
      return sum + priceAsNumber;
    }, 0);
    return new Intl.NumberFormat('sv-SE').format(numericTotal);
  };

  const handleCheckout = () => {
    if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-neutral-950 to-black text-slate-100 overflow-x-hidden font-sans relative scroll-smooth">
      
      {/* SUBTIL PORTFOLIOSPÄRR HÖGST UPP PÅ SIDAN */}
      <div className="w-full bg-slate-950 border-b border-slate-900/60 py-2.5 text-center text-[10px] tracking-[0.2em] text-slate-500 font-mono uppercase z-40 relative px-4">
        Portfolio Concept MVP — No physical products are for sale. Backend powered by Supabase.
      </div>

      {/* 1. NAVIGERING */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-30">
        <div className="text-3xl font-medium tracking-[0.25em] text-white font-basalt">
          BASALT
        </div>
        <nav className="hidden md:flex gap-8 text-xs tracking-widest text-slate-400 font-medium">
          <a href="#collection" className="hover:text-white transition-colors">COLLECTION</a>
          <button onClick={() => setIsHeritageOpen(true)} className="hover:text-white transition-colors">HERITAGE</button>
          <span className="text-slate-600">|</span>
          <span className="text-sky-400 font-mono text-[10px] tracking-normal uppercase self-center">Supabase Live</span>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
              setIsCartOpen(true);
            }}
            className="relative p-2 text-slate-300 hover:text-white transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-105 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.119-1.243l1.264-12A1.125 1.125 0 0 1 5.656 7.5h12.688a1.125 1.125 0 0 1 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-sky-500 text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative min-h-[calc(100vh-140px)]">
        
        {/* VÄNSTER SPALT: PRODUKTTEXTER */}
        <div className="lg:col-span-5 z-20 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/40 border border-slate-700/30 text-xs tracking-widest text-slate-400 font-medium uppercase">
            <span>PREMIUM AUTOMATIC</span>
          </div>
          
          {/* STABIL TITEL-CONTAINER */}
          <div className="h-[130px] sm:h-[150px] lg:h-[200px] flex items-center lg:items-start justify-center lg:justify-start">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight uppercase">
              THE {activeModel}
            </h1>
          </div>
          
          {/* STABIL TEXT-BOX FÖR BESKRIVNINGEN */}
          <div className="h-[140px] sm:h-[110px] md:h-[95px] flex items-start">
            <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto lg:mx-0 font-light leading-relaxed">
              {productData.description}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-mono font-medium text-white">
              {productData.price} SEK
            </div>
            
            <div className="text-[11px] font-mono tracking-wider pt-1 flex justify-center lg:justify-start items-center gap-1.5">
              {stockLeft > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-medium">{stockLeft} UNITS LEFT IN STOCK</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-rose-500 font-bold uppercase tracking-widest">OUT OF STOCK (MAX LIMIT REACHED)</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button 
              onClick={handleAddToCart}
              disabled={stockLeft <= 0}
              className={`px-8 py-4 font-semibold text-sm tracking-wider transition-all duration-300 shadow-lg active:scale-95 ${
                stockLeft > 0 
                  ? 'bg-white text-black hover:bg-slate-200 shadow-white/5' 
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/30'
              }`}
            >
              {stockLeft > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            <a 
              href="#collection"
              className="px-8 py-4 border border-slate-700 text-slate-300 font-medium text-sm tracking-wider hover:text-white hover:border-white transition-all duration-300 active:scale-95 text-center block"
            >
              VIEW COLLECTION
            </a>
          </div>
        </div>

        {/* HÖGER SPALT: LÅST BILD-CONTAINER */}
        <div className="lg:col-span-7 relative flex justify-center items-center z-10 h-[320px] sm:h-[420px] lg:h-[500px]">
          <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-sky-500/5 rounded-full blur-[100px] -z-10 animate-pulse duration-[6000ms]" />

          <img 
            src={modelImages[activeModel]} 
            alt={`Basalt ${activeModel}`} 
            className="h-[280px] sm:h-[380px] lg:h-[460px] w-auto object-contain filter drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)] transform hover:scale-[1.03] transition-all duration-500 ease-out"
          />
        </div>

        {/* MODELLVÄLJARE */}
        <footer className="absolute bottom-6 left-0 w-full z-20 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 flex justify-center lg:justify-end">
            <div className="flex gap-3 bg-black/40 backdrop-blur-md p-2 border border-slate-800/80 rounded-sm">
              {['Tactical Edition', 'Ghost Ops', 'Commando Steel'].map((name) => (
                <button
                  key={name}
                  onClick={() => setActiveModel(name)}
                  className={`px-4 py-3 text-xs tracking-widest font-mono transition-all duration-300 ${
                    activeModel === name
                      ? 'bg-slate-800 text-sky-400 border border-sky-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* ================= COLLECTION IMAGE SECTION ================= */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900 relative z-20">
        <div className="text-center space-y-4 pb-12">
          <span className="text-[10px] tracking-[0.3em] text-sky-400 font-mono uppercase">The Family</span>
          <h2 className="text-3xl font-bold tracking-widest text-white uppercase">THE BASALT LINEUP</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto font-light">
            Three distinct iterations engineered for durability, precision and absolute aesthetic purpose.
          </p>
        </div>
        
        <div className="flex justify-center items-center w-full overflow-hidden rounded-sm border border-slate-900 bg-neutral-950/20 p-4 sm:p-8">
          <img 
            src={collectionImage} 
            alt="Basalt Full Watch Collection" 
            className="w-full h-auto object-contain max-w-5xl filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          />
        </div>
      </section>

      {/* ================= SIDE CART DRAWER ================= */}
      <div 
        onClick={() => {
          if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
          setIsCartOpen(false);
        }}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-neutral-950 border-l border-slate-800/80 z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div>
          <div className="flex justify-between items-center pb-6 border-b border-slate-800">
            <h2 className="text-lg font-mono tracking-widest text-white uppercase">YOUR CART ({cart.length})</h2>
            <button 
              onClick={() => {
                if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
                setIsCartOpen(false);
              }} 
              className="text-slate-400 hover:text-white text-xs tracking-widest"
            >
              CLOSE ✕
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh] pt-4 space-y-4">
            {cart.length === 0 ? (
              <p className="text-slate-500 text-sm font-light pt-8 text-center">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-900/30 p-3 border border-slate-900 rounded-sm">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain filter drop-shadow-md" />
                    <div>
                      <h3 className="text-white text-xs font-semibold uppercase tracking-wider">{item.name}</h3>
                      <p className="text-slate-400 font-mono text-xs pt-0.5">{item.price} SEK</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-slate-500 hover:text-rose-400 text-sm px-2 py-1 transition-colors">✕</button>
                </div>
              ))
            )}
          </div>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-between items-center text-sm tracking-wide">
              <span className="text-slate-400 font-light">TOTAL (ESTIMATED)</span>
              <span className="text-white font-mono font-medium text-lg">{calculateTotal()} SEK</span>
            </div>
            <button onClick={handleCheckout} className="w-full py-4 bg-sky-500 text-black font-bold text-xs tracking-widest hover:bg-sky-400 transition-colors uppercase rounded-sm">
              PROCEED TO CHECKOUT
            </button>
            <p className="text-[10px] text-center text-slate-500 font-mono">MVP Sandbox - No real currency will be charged</p>
          </div>
        )}
      </div>

      {/* ================= SIMULERAD BETALNINGSSUCCÉ ================= */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-900 border border-slate-800 p-8 max-w-md w-full text-center rounded-sm space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center mx-auto text-xl border border-sky-500/20">✓</div>
            <h3 className="text-xl font-mono tracking-wider text-white uppercase">ORDER PLACED SUCCESSFULLY</h3>
            <p className="text-slate-400 text-sm font-light">
              Detta simulerar en komplett checkout! Din order har registrerats i applikationens lokala state. På ett riktigt jobb hade vi här triggat en Stripe-webhook eller skapat en order-rad i en Supabase-tabell.
            </p>
            <button onClick={() => { setIsCheckoutSuccess(false); setIsCartOpen(false); }} className="px-6 py-2.5 bg-white text-black font-semibold text-xs tracking-widest hover:bg-slate-200 transition-colors uppercase">
              Back to Store
            </button>
          </div>
        </div>
      )}

      {/* ================= BRAND MANIFESTO (HERITAGE) MODAL ================= */}
      {isHeritageOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-neutral-950 border border-slate-800/80 p-8 max-w-lg w-full rounded-sm space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.3em] text-sky-400 font-mono font-bold uppercase">Our Legacy</span>
              <h3 className="text-2xl font-medium tracking-[0.2em] text-white uppercase font-basalt">THE BASALT MANIFESTO</h3>
            </div>
            <hr className="border-slate-800" />
            <div className="space-y-4 text-slate-400 text-xs sm:text-sm font-light leading-relaxed tracking-wide text-justify">
              <p>
                Born from the subterranean forces of the Scandinavian bedrock, <strong className="text-white font-medium">BASALT</strong> was founded in the cold north with a singular mission: to engineer indestructible automatic timepieces that bridge the gap between tactical utility and raw minimalist aesthetics.
              </p>
              <p>
                We do not believe in superficial luxury. Every curve, every surface, and every gram of weight in a BASALT watch is there for a reason. Forged from high-grade marine stainless steel or shielded with matte diamond-like carbon (DLC), our cases protect Japanese automatic movements calibrated for relentless precision.
              </p>
              <p className="italic text-slate-300 border-l-2 border-sky-500/40 pl-3 py-1 font-mono text-xs">
                "Built to endure the elements. Crafted for those who navigate the shadows."
              </p>
            </div>
            <div className="pt-2 text-center">
              <button onClick={() => setIsHeritageOpen(false)} className="w-full sm:w-auto px-8 py-3 bg-white text-black font-semibold text-xs tracking-widest hover:bg-slate-200 transition-colors uppercase rounded-sm">
                Return to collection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;