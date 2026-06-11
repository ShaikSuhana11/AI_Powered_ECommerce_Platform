import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, ShoppingBag, Bot, Plus, Minus, Trash2, 
  Percent, Truck, ShieldCheck, TrendingUp, Sparkles, AlertTriangle, 
  ChevronRight, Star, Check, CheckCircle2, RefreshCw, Sliders, X, 
  Coins, MessageSquare, MapPin, HelpCircle, Send, Activity, FileText, 
  DollarSign, ArrowUpRight, Share2, Eye, ShieldAlert, Award, Clock,
  LogOut, Lock
} from 'lucide-react';
import { 
  mockProducts, 
  mockProductVariants, 
  mockReviews, 
  mockSellers, 
  mockCategories, 
  mockCoupons, 
  mockOrders, 
  mockUsers, 
  mockAddresses 
} from './dbMock';
import { Product, ProductVariant, Seller, Category, Review, Coupon, Order, OrderStatus, User, Address, AIChatMessage } from './types';

export default function App() {
  // --- APPLICATION STATES ---
  const [activeTab, setActiveTab] = useState<'customer' | 'seller' | 'admin'>('customer');
  const [activeUser, setActiveUser] = useState<User>(mockUsers[0]);
  const [activeAddresses, setActiveAddresses] = useState<Address[]>(mockAddresses);
  
  // --- AUTH SECURITY GATE ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default with Alex Chen, click "Sign Out" to transition
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authRoleInput, setAuthRoleInput] = useState<'customer' | 'seller' | 'admin'>('customer');
  const [authRememberMe, setAuthRememberMe] = useState(true);
  const [authOtpMode, setAuthOtpMode] = useState(false);
  const [authOtpInput, setAuthOtpInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Dynamic collections that can edit state in real-time
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(400);
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [onlyAiRecommended, setOnlyAiRecommended] = useState<boolean>(false);
  const [sortingOption, setSortingOption] = useState<string>('popular');

  // Interactive Product Detail Modal
  const [detailedProduct, setDetailedProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  
  // Write reviews analytical tools
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isAnalyzingReview, setIsAnalyzingReview] = useState(false);
  const [reviewAnalysisResult, setReviewAnalysisResult] = useState<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
    isFlaggedFake: boolean;
    aiReviewSummary: string;
  } | null>(null);

  // Shopping Cart drawer & Checkout
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ productId: string; variantId: string; quantity: number }[]>([
    { productId: 'prod_prism_watch', variantId: 'var_prism_titanium_space', quantity: 1 }
  ]);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'razorpay' | 'cod'>('stripe');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  // AI Chatbot Concierge Drawer
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      text: 'Greetings, I am your dedicated **Nexus E-Commerce Concierge**. How may I guide your multi-vendor exploration today? I can track shipments, detail technical specifications, or unlock exclusive promotional keys.',
      createdAt: new Date().toISOString()
    }
  ]);
  const [chatbotInput, setChatbotInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Dynamic Pricing Panel & Forecaster inside Seller dashboard
  const [selectedSellerProductPriceOptId, setSelectedSellerProductPriceOptId] = useState<string>('prod_prism_watch');
  const [optimizingPrice, setOptimizingPrice] = useState(false);
  const [calculatedPriceSuggestion, setCalculatedPriceSuggestion] = useState<{
    optimizedPrice: number;
    demandFactor: number;
    justification: string;
  } | null>(null);

  const [forecastingDemand, setForecastingDemand] = useState(false);
  const [forecastResult, setForecastResult] = useState<{
    predictedDemandUnits: number;
    isHighChurnRisk: boolean;
    retentionScore: number;
    forecastSummary: string;
  } | null>(null);

  // General Settings
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'INR'>('INR');
  const [language, setLanguage] = useState<'EN' | 'ES' | 'FR'>('EN');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referredBySuccess, setReferredBySuccess] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show dynamic toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Convert localized Price
  const formatPrice = (priceUSD: number) => {
    let rate = 1;
    let symbol = '$';
    if (currency === 'EUR') {
      rate = 0.92;
      symbol = '€';
    } else if (currency === 'INR') {
      rate = 83.5;
      symbol = '₹';
    }
    return `${symbol}${Math.round(priceUSD * rate)}`;
  };

  // --- BUSINESS LOGIC CALCULATIONS ---

  // Auto-complete suggestions for Smart Search
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)).slice(0, 3);
  }, [searchQuery, products]);

  // Detected User Search Intent
  const detectedSearchIntent = useMemo(() => {
    if (!searchQuery) return null;
    const term = searchQuery.toLowerCase();
    if (term.includes('watch') || term.includes('screen') || term.includes('hologram') || term.includes('titanium')) {
      return 'Smart Tech & Biotech Wearables Segment';
    }
    if (term.includes('wool') || term.includes('parka') || term.includes('outer') || term.includes('bamboo') || term.includes('clothing')) {
      return 'Sustainable Premium Apparel Segment';
    }
    if (term.includes('light') || term.includes('circadian') || term.includes('led') || term.includes('sound')) {
      return 'Biophilic Spatial Living Architecture';
    }
    return 'General Exploration Search Intent';
  }, [searchQuery]);

  // Handle dynamic filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query match
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        Object.values(p.specs).some(val => (val as string).toLowerCase().includes(term))
      );
    }

    // Category match
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Seller match
    if (selectedSeller) {
      result = result.filter(p => p.sellerId === selectedSeller);
    }

    // AI Recommended toggle
    if (onlyAiRecommended) {
      result = result.filter(p => p.isAiRecommended);
    }

    // Price ceiling selection
    result = result.filter(p => p.basePrice <= selectedPriceRange);

    // Sorting
    if (sortingOption === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortingOption === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortingOption === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating);
    } else {
      // Popular (Featured flag or count sequence)
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSeller, onlyAiRecommended, selectedPriceRange, sortingOption]);

  // Subtotal of checkout items
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    cart.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      const v = mockProductVariants.find(variant => variant.id === item.variantId);
      if (p && v) {
        // use variant price if set, otherwise base price adjusted for dynamic coupon if applicable
        const price = v.price;
        subtotal += price * item.quantity;
      }
    });

    let discountAmount = 0;
    if (activeCoupon) {
      if (subtotal >= activeCoupon.minOrderValue) {
        discountAmount = Math.min(
          subtotal * (activeCoupon.discountPercentage / 100), 
          activeCoupon.maxDiscountAmount
        );
      }
    }

    const netSubtotal = subtotal - discountAmount;
    const tax = netSubtotal * 0.18; // 18% standard VAT/Tax
    const shippingCharge = netSubtotal > 150 ? 0 : 15.00; // Free shipping above $150
    const total = netSubtotal + tax + shippingCharge;

    return {
      rawSubtotal: subtotal,
      discountAmount,
      appliedCode: activeCoupon?.code || null,
      tax,
      shippingCharge,
      total
    };
  }, [cart, products, activeCoupon]);

  // Find variants for currently detailed product modal
  const detailedProductVariants = useMemo(() => {
    if (!detailedProduct) return [];
    return mockProductVariants.filter(v => v.productId === detailedProduct.id);
  }, [detailedProduct]);

  // Find reviews of currently detailed product
  const detailedProductReviews = useMemo(() => {
    if (!detailedProduct) return [];
    return reviews.filter(r => r.productId === detailedProduct.id);
  }, [detailedProduct, reviews]);

  // Active product variant selection trigger
  useEffect(() => {
    if (detailedProductVariants.length > 0) {
      setSelectedVariantId(detailedProductVariants[0].id);
    } else {
      setSelectedVariantId(null);
    }
    setActiveImageIdx(0);
  }, [detailedProduct, detailedProductVariants]);

  // --- SERVER API CALL FLOWS ---

  // AI Shopping assistant fetch
  const handleSendChatbotMessage = async (alternativeText?: string) => {
    const textToSend = alternativeText || chatbotInput;
    if (!textToSend.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatbotInput('');
    setChatLoading(true);

    try {
      const payloadMessages = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          productId: detailedProduct?.id || null
        })
      });

      const data = await res.json();
      setChatMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: data.text || 'Concierge service encountered a timeout; reverting to offline backup buffers.',
        createdAt: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Chat API Error:', err);
      // Fallback response simulation
      setChatMessages(prev => [...prev, {
        id: `ai_err_${Date.now()}`,
        role: 'model',
        text: 'The API is currently syncing localized caches. You can complete checkout using credit code **ENTERPRISE30** for immediate 30% savings!',
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Submit and automated evaluate user review
  const handleAnalyzeAndSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim() || !detailedProduct) return;

    setIsAnalyzingReview(true);
    triggerToast('Submitting review comment to neural pattern analysis framework...');

    try {
      const res = await fetch('/api/ai/analyze-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: newReviewComment,
          rating: newReviewRating
        })
      });

      const data = await res.json();
      setReviewAnalysisResult(data);

      const createdReview: Review = {
        id: `rev_custom_${Date.now()}`,
        productId: detailedProduct.id,
        userId: activeUser.id,
        userName: `${activeUser.firstName} ${activeUser.lastName}`,
        rating: newReviewRating,
        comment: newReviewComment,
        isVerifiedPurchase: true,
        helpfulVotes: 0,
        sentiment: data.sentiment,
        sentimentConfidence: data.confidence,
        isFlaggedFake: data.isFlaggedFake,
        aiReviewSummary: data.aiReviewSummary || 'Verified transactional check completed.',
        createdAt: new Date().toISOString()
      };

      // Add to state reviews
      setReviews(prev => [createdReview, ...prev]);

      // Feedback Toast
      if (data.isFlaggedFake) {
        triggerToast('⚠️ Review flagged! Our automated fraud radar classified this review block as highly spammy or non-genuine.');
      } else {
        triggerToast('✨ Review approved. Sentiment classified as ' + data.sentiment.toUpperCase() + ' with ' + Math.round(data.confidence * 100) + '% confidence.');
      }

      setNewReviewComment('');
    } catch (err) {
      console.error(err);
      triggerToast('Local review processing cached successfully.');
    } finally {
      setIsAnalyzingReview(false);
    }
  };

  // Seller module: AI-assisted price optimization call
  const triggerPriceOptimization = async (prodId: string) => {
    const targetProd = products.find(p => p.id === prodId);
    if (!targetProd) return;

    setOptimizingPrice(true);
    triggerToast('Simulating market demand index and pricing arrays...');

    try {
      // Pick random factors to optimize
      const isWatch = prodId.includes('watch');
      const compPrice = isWatch ? 340 : targetProd.basePrice + 15;
      
      const res = await fetch('/api/ai/pricing-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId,
          currentPrice: targetProd.basePrice,
          competitorPrice: compPrice,
          seasonFactor: 1.15,
          recentSalesVolume: isWatch ? 14 : 3
        })
      });

      const data = await res.json();
      setCalculatedPriceSuggestion(data);
      triggerToast('AI Pricing Strategy recommendations ready for evaluation!');
    } catch (err) {
      console.error(err);
      triggerToast('Unable to complete cloud pricing model optimization.');
    } finally {
      setOptimizingPrice(false);
    }
  };

  // Apply Price Optimization permanently in-memory
  const applyPriceOptimization = () => {
    if (!calculatedPriceSuggestion) return;
    setProducts(prev => prev.map(p => {
      if (p.id === selectedSellerProductPriceOptId) {
        return {
          ...p,
          basePrice: calculatedPriceSuggestion.optimizedPrice
        };
      }
      return p;
    }));
    triggerToast(`Optimized base price of ${products.find(p => p.id === selectedSellerProductPriceOptId)?.name} updated to ${formatPrice(calculatedPriceSuggestion.optimizedPrice)}!`);
    setCalculatedPriceSuggestion(null);
  };

  // Seller Dashboard: Predict Demand & Retention Churn risk
  const triggerDemandForecaster = async () => {
    setForecastingDemand(true);
    try {
      const res = await fetch('/api/ai/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataPayload: {
            products: products.length,
            reviewsCount: reviews.length,
            activeSellers: mockSellers.length,
            buyerLoyaltyPoints: activeUser.loyaltyPoints
          }
        })
      });
      const data = await res.json();
      setForecastResult(data);
      triggerToast('Demand trajectory forecast generated successfully.');
    } catch (err) {
      console.error(err);
      triggerToast('Fitted standard linear moving averages fallback.');
    } finally {
      setForecastingDemand(false);
    }
  };

  // Apply Coupon code from cart
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const term = couponCodeInput.toUpperCase().trim();
    const matched = mockCoupons.find(c => c.code === term);
    if (matched) {
      setActiveCoupon(matched);
      triggerToast(`Coupon code ${matched.code} applied! Enjoy ${matched.discountPercentage}% discount packaging.`);
      setCouponCodeInput('');
    } else {
      triggerToast('❌ Error: Input coupon code is expired or invalid.');
    }
  };

  // Referral point system simulation
  const handleApplyReferral = () => {
    if (!referralCodeInput.trim()) return;
    const cleanCode = referralCodeInput.toUpperCase().trim();
    if (cleanCode === activeUser.referralCode) {
      triggerToast('❌ Cannot reference your own account code.');
      return;
    }
    setReferredBySuccess(cleanCode);
    setActiveUser(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + 150 // award verification bonus points
    }));
    triggerToast('🎉 Code Verified! 150 loyalty tokens credited to account Alex Chen.');
    setReferralCodeInput('');
  };

  // Checkout submission
  const handleProceedCheckout = () => {
    if (cart.length === 0) {
      triggerToast('Basket is empty.');
      return;
    }
    // Enter OTP mode for fraud-safe two-factor auth
    setOtpMode(true);
  };

  // Verify OTP Security key
  const handleVerifyOtpCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '2026' || otpInput === '1234' || otpInput.length >= 4) {
      // Success Order Generation
      const newOrder: Order = {
        id: `ord_${Math.floor(1000 + Math.random() * 9000)}`,
        userId: activeUser.id,
        sellerId: products.find(p => p.id === cart[0].productId)?.sellerId || 'seller_1',
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceAtPurchase: products.find(p => p.id === item.productId)?.basePrice || 100
        })),
        subtotal: cartTotals.rawSubtotal,
        tax: cartTotals.tax,
        shippingCharge: cartTotals.shippingCharge,
        discountAmount: cartTotals.discountAmount,
        total: cartTotals.total,
        status: OrderStatus.CONFIRMED,
        paymentMethod: selectedPaymentMethod === 'stripe' ? 'Stripe Gateway Sec' : selectedPaymentMethod === 'razorpay' ? 'Razorpay Integrated UPI' : 'Cash on Delivery',
        paymentStatus: selectedPaymentMethod === 'cod' ? 'PENDING' : 'COMPLETED',
        addressId: activeAddresses[0]?.id || 'addr_1',
        createdAt: new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);
      setActiveUser(prev => ({
        ...prev,
        loyaltyPoints: prev.loyaltyPoints + Math.round(cartTotals.total * 0.1) // 10% cashpoint loyalty reward
      }));

      setCart([]);
      setOtpMode(false);
      setCheckoutSuccess(true);
      setCartOpen(false);
      triggerToast('🎉 Order confirmed. Safe token settlement confirmed by financial processors.');
    } else {
      setOtpError('Invalid OTP code. Enter 2026 or any 4 digit security block to pass standard validation.');
    }
  };

  // UI state Helpers
  const addToCart = (prodId: string, variantId: string) => {
    const existingIdx = cart.findIndex(item => item.variantId === variantId);
    if (existingIdx > -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart(prev => [...prev, { productId: prodId, variantId, quantity: 1 }]);
    }
    triggerToast('Added to circular procurement basket.');
  };

  const removeCartItem = (variantId: string) => {
    setCart(prev => prev.filter(c => c.variantId !== variantId));
  };

  const updateCartQty = (variantId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.variantId === variantId) {
        const nextQty = c.quantity + delta;
        return { ...c, quantity: nextQty < 1 ? 1 : nextQty };
      }
      return c;
    }));
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(activeUser.referralCode);
    setCopiedReferral(true);
    triggerToast('Referral invitation code copied to clipboard!');
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  // --- AUTHENTICATION ACTION PORTAL CORE ---
  const [selectedAuthAvatar, setSelectedAuthAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [authReferralCode, setAuthReferralCode] = useState('');
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  const avatarPresets = [
    { name: 'Sneha Rao', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
    { name: 'Karan Mehra', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Priya Patel', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { name: 'Amit Sharma', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
  ];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      triggerToast("Error: Missing credentials. Please input both email and password.");
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      // Simulate 2FA check if enabled
      if (authOtpMode && !authOtpInput) {
        setIsAuthLoading(false);
        triggerToast("Step Required: Two-Factor OTP security code verification pending.");
        return;
      }
      if (authOtpMode && authOtpInput !== '123456') {
        setIsAuthLoading(false);
        triggerToast("Error: Invalid OTP security number. Please use demo code '123456'.");
        return;
      }

      // Check if matches any mockUsers
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === authEmail.toLowerCase());
      if (foundUser) {
        setActiveUser(foundUser);
        setActiveTab(foundUser.role as any);
      } else {
        // Fallback simulated user
        const generatedUser: User = {
          id: 'user_created',
          email: authEmail,
          firstName: authFirstName || authEmail.split('@')[0],
          lastName: authLastName || 'Enterprise',
          role: authRoleInput,
          avatar: selectedAuthAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
          loyaltyPoints: authReferralCode.toUpperCase() === 'ALEX9F83' ? 500 : 100,
          referralCode: 'MEMBER_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
          createdAt: new Date().toISOString()
        };
        setActiveUser(generatedUser);
        setActiveTab(authRoleInput);
      }

      setIsLoggedIn(true);
      setIsAuthLoading(false);
      triggerToast(`Verification passed. Session initialized successfully for ${authEmail}!`);
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim() || !authFirstName.trim()) {
      triggerToast("Error: Missing onboarding attributes. Email, Password, and First Name are mandatory.");
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      const generatedUser: User = {
        id: 'user_' + Date.now(),
        email: authEmail,
        firstName: authFirstName,
        lastName: authLastName || 'Core',
        role: authRoleInput,
        avatar: selectedAuthAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        loyaltyPoints: authReferralCode.toUpperCase() === 'ALEX9F83' ? 500 : 100, // 500 points starting bonus for using referral code!
        referralCode: authFirstName.toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      setActiveUser(generatedUser);
      setActiveTab(authRoleInput);
      setIsLoggedIn(true);
      setIsAuthLoading(false);
      triggerToast(`Account created as ${authFirstName} ${authLastName || ''}! Welcome to NexusCore!`);
    }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      triggerToast("Error: Please specify the recovery email location.");
      return;
    }
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setForgotEmailSent(true);
      triggerToast(`Dispatched secure recovery link token to: ${authEmail}`);
    }, 1000);
  };

  const loginDemoAccount = (email: string, pass: string, role: 'customer' | 'seller' | 'admin') => {
    setAuthEmail(email);
    setAuthPassword(pass);
    setAuthRoleInput(role);
    triggerToast(`Demo properties pre-filled. Initiating connection protocols...`);
    setIsAuthLoading(true);
    setTimeout(() => {
      const matchedUser = mockUsers.find(u => u.email === email);
      if (matchedUser) {
        setActiveUser(matchedUser);
        setActiveTab(role);
      } else {
        // Admin or seller fallback build
        setActiveUser({
          id: 'user_admin',
          email: email,
          firstName: role === 'admin' ? 'System' : 'Sarah',
          lastName: role === 'admin' ? 'Administrator' : 'Jenkins',
          role: role as any,
          avatar: role === 'admin' 
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' 
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          loyaltyPoints: 10000,
          referralCode: 'GOLDDECK',
          createdAt: new Date().toISOString()
        });
        setActiveTab(role);
      }
      setIsLoggedIn(true);
      setIsAuthLoading(false);
      triggerToast(`Connected as ${role.toUpperCase()} segment! Welcome inside NexusCore.`);
    }, 850);
  };

  // --- RENDERING SECURE CONTEXT GATE ---
  if (!isLoggedIn) {
    return (
      <div id="nexus_secure_auth_wall" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white relative font-sans antialiased overflow-x-hidden">
        
        {/* Dynamic stars/grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Auth page static top bar */}
        <header className="px-6 sm:px-12 py-5 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-md">
                N
              </div>
              <div>
                <span className="text-sm font-black tracking-wider text-white flex items-center gap-1">
                  NEXUS<span className="text-indigo-400 font-light tracking-widest">CORE</span>
                </span>
                <p className="text-[8px] font-mono text-indigo-400 tracking-widest uppercase">Federated Identity Gateway</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsLoggedIn(true); 
                triggerToast("Bypassed Gateway. Playing in Sandbox Guest Mode.");
              }} 
              className="text-xs font-semibold px-4 py-1.5 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700 transition-all text-indigo-300"
            >
              Demo Sandbox Entry
            </button>
          </div>
        </header>

        {/* Global Floating Toast within Auth */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-indigo-950 text-white rounded-lg px-4 py-3 shadow-2xl border border-indigo-700 flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <p className="text-xs font-mono tracking-normal leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-0.5 rounded">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main interactive panel setup */}
        <main className="flex-grow z-10 flex items-center justify-center py-12 px-4 sm:px-8 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: BRAND PROMOTION (Hidden on mobile models) */}
          <section className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-8 pr-6 text-left">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-950 border border-indigo-800 text-indigo-300 tracking-widest uppercase">
                VERSION 2.6 ENTERPRISE COMMERCE
              </span>
              <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-none">
                Single Sign-On for <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">Multi-Vendor Worlds</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                NexusCore automates dynamic yield pricing, multi-persona vendor fulfillment, and suspicious client behavior tracking with embedded real-time statistics.
              </p>
            </div>

            {/* Micro bento points */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-xl space-y-1">
                <p className="text-xs font-mono text-indigo-400 uppercase font-black tracking-wider">Dynamic Yield</p>
                <p className="text-[11px] text-slate-400">Heuristic analytical repricing engine proxies automated sales margins instantly.</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-xl space-y-1">
                <p className="text-xs font-mono text-indigo-400 uppercase font-black tracking-wider">Fraud Monitor</p>
                <p className="text-[11px] text-slate-400">Advanced user sentiment tracking identifies automated fake reviews and spikes.</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-xl space-y-1">
                <p className="text-xs font-mono text-indigo-400 uppercase font-black tracking-wider">Referral Codes</p>
                <p className="text-[11px] text-slate-400">Custom invitation vectors issue bonus loyalty points across peer networks.</p>
              </div>
              <div className="p-4 bg-slate-900/60 border border-slate-900 rounded-xl space-y-1">
                <p className="text-xs font-mono text-indigo-400 uppercase font-black tracking-wider">2FA Guarded</p>
                <p className="text-[11px] text-slate-400">Multi-factor security systems keep administrator keys locked and safe.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>Encrypted with SHA256 and verified through local security nodes in active sessions.</span>
            </div>
          </section>

          {/* RIGHT COLUMN: INTERACTIVE LOGIN WINDOW */}
          <section className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center">
            
            {/* Quick Demo Access Header banner */}
            <div className="w-full max-w-md mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold mb-2">⚡ Developer Fast-Pass Logins</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <button 
                  onClick={() => loginDemoAccount('buyer@enterprise.com', 'pass123', 'customer')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded font-mono text-[9px] border border-indigo-950 hover:border-indigo-900 transition"
                >
                  👤 Customer Hub
                </button>
                <button 
                  onClick={() => loginDemoAccount('jane.smith@global.com', 'pass123', 'seller')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded font-mono text-[9px] border border-amber-950 hover:border-amber-900 transition"
                >
                  🏬 Seller Deck
                </button>
                <button 
                  onClick={() => loginDemoAccount('admin@nexus.com', 'pass123', 'admin')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-rose-300 rounded font-mono text-[9px] border border-rose-950 hover:border-rose-900 transition"
                >
                  🔒 Root Admin
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
              
              {/* Layout Modes Tabs */}
              <div className="flex border-b border-slate-850 mb-6 font-mono text-xs font-semibold">
                <button 
                  onClick={() => { setAuthMode('login'); setForgotEmailSent(false); }}
                  className={`flex-1 pb-3 text-center tracking-widest ${authMode === 'login' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  SIGN IN
                </button>
                <button 
                  onClick={() => { setAuthMode('register'); setForgotEmailSent(false); }}
                  className={`flex-1 pb-3 text-center tracking-widest ${authMode === 'register' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  REGISTER
                </button>
                <button 
                  onClick={() => { setAuthMode('forgot-password'); setForgotEmailSent(false); }}
                  className={`flex-1 pb-3 text-center tracking-widest ${authMode === 'forgot-password' ? 'text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  RECOVERY
                </button>
              </div>

              {/* MODE 1: LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Email Address ID</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g., buyer@enterprise.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Secure Password</label>
                      <button 
                        type="button" 
                        onClick={() => setAuthMode('forgot-password')} 
                        className="text-[10px] font-mono text-indigo-400 hover:underline"
                      >
                        Forgot Pass?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      required
                      placeholder="Enter credentials password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  {/* 2-Factor check toggle */}
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={authOtpMode}
                        onChange={(e) => setAuthOtpMode(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-indigo-400" />
                        Enable Two-Factor Auth 2FA (OTP)
                      </span>
                    </label>

                    {authOtpMode && (
                      <div className="animate-fade-in space-y-1">
                        <p className="text-[9px] font-mono text-indigo-300">Enter simulation key: <span className="font-bold underline text-white">123456</span></p>
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="Verification Code 6-Digit"
                          value={authOtpInput}
                          onChange={(e) => setAuthOtpInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-900 border border-indigo-900 font-mono tracking-widest text-center rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input 
                      id="remember_me_check"
                      type="checkbox" 
                      checked={authRememberMe}
                      onChange={(e) => setAuthRememberMe(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <label htmlFor="remember_me_check" className="ml-2 text-[10px] text-slate-400 font-mono uppercase tracking-wider cursor-pointer">
                      Keep security token in local session memory
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isAuthLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 hover:shadow-lg hover:shadow-indigo-550/20 text-white font-bold text-xs py-3 rounded-lg font-mono tracking-widest transition-all uppercase flex items-center justify-center gap-2 mt-4"
                  >
                    {isAuthLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>Verify Credentials & Launch</>
                    )}
                  </button>
                </form>
              )}

              {/* MODE 2: REGISTER */}
              {authMode === 'register' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">First Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Alex"
                        value={authFirstName}
                        onChange={(e) => setAuthFirstName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Chen"
                        value={authLastName}
                        onChange={(e) => setAuthLastName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="buyer@enterprise.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">Select Hub Entry Persona</label>
                    <select 
                      value={authRoleInput}
                      onChange={(e) => setAuthRoleInput(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-400 focus:outline-none focus:border-indigo-500 font-mono"
                    >
                      <option value="customer">Customer Hub (Explore & Checkout)</option>
                      <option value="seller">Seller Deck (Manage & Dynamic Pricing)</option>
                      <option value="admin">Fraud & Admin Console (Stat Analysis)</option>
                    </select>
                  </div>

                  {/* Preset Avatar Picker */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Select Identity Avatar</label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500 bg-slate-850 shrink-0">
                        <img src={selectedAuthAvatar} alt="Chosen bio avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto py-1">
                        {avatarPresets.map((preset) => (
                          <button 
                            key={preset.name}
                            type="button"
                            onClick={() => setSelectedAuthAvatar(preset.url)}
                            className={`px-2 py-1 text-[10px] font-mono rounded border ${selectedAuthAvatar === preset.url ? 'bg-indigo-950 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">Invitation Referral Code (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ALEX9F83 (Get 500 points!)"
                      value={authReferralCode}
                      onChange={(e) => setAuthReferralCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isAuthLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 hover:shadow-lg text-white font-bold text-xs py-3 rounded-lg font-mono tracking-widest transition-all uppercase flex items-center justify-center gap-2"
                  >
                    {isAuthLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>Create Profile & Login</>
                    )}
                  </button>
                </form>
              )}

              {/* MODE 3: FORGOT PASSWORD */}
              {authMode === 'forgot-password' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="text-center space-y-2 mb-4">
                    <p className="text-xs text-slate-400">
                      Specify your email to receive simulated temporal access links bypassing identity verification walls:
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Your Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g., buyer@enterprise.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {forgotEmailSent && (
                    <div className="p-3 bg-emerald-950/50 border border-emerald-950 rounded-lg text-emerald-400 text-xs text-center font-mono">
                      ✓ Recovery dynamic token generated! Use bypass fast-login button above to continue testing immediately.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isAuthLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white font-bold text-xs py-3 rounded-lg font-mono tracking-widest transition-all uppercase flex items-center justify-center gap-2"
                  >
                    {isAuthLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Dispatch Recovery Key Link</>
                    )}
                  </button>
                </form>
              )}

              {/* Secure federated OAuth mock login row */}
              <div className="relative my-6 text-center">
                <hr className="border-slate-850" />
                <span className="absolute -top-2 bg-slate-900 px-3 text-[9px] font-mono text-slate-500 tracking-wider uppercase left-1/2 -translate-x-1/2">
                  Social Federation Access
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    triggerToast("Simulating secure federated authentication via Google OAuth API...");
                    setIsAuthLoading(true);
                    setTimeout(() => {
                      loginDemoAccount('buyer@enterprise.com', 'pass123', 'customer');
                    }, 1000);
                  }}
                  className="flex justify-center items-center py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <span className="text-[10px] font-mono">Google</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    triggerToast("Simulating secure federated authentication via GitHub OAuth API...");
                    setIsAuthLoading(true);
                    setTimeout(() => {
                      loginDemoAccount('jane.smith@global.com', 'pass123', 'seller');
                    }, 1000);
                  }}
                  className="flex justify-center items-center py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-850 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <span className="text-[10px] font-mono font-bold">GitHub</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    triggerToast("Simulating secure federated authentication via Apple CoreID token encryption...");
                    setIsAuthLoading(true);
                    setTimeout(() => {
                      loginDemoAccount('admin@nexus.com', 'pass123', 'admin');
                    }, 1000);
                  }}
                  className="flex justify-center items-center py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-900 rounded-lg text-slate-400 hover:text-white transition"
                >
                  <span className="text-[10px] font-mono">Apple</span>
                </button>
              </div>

            </div>
          </section>

        </main>

        {/* Static footer */}
        <footer className="py-6 border-t border-slate-900 bg-slate-950/80 text-center text-[10px] font-mono text-slate-600">
          <p>© 2026 NEXUSCORE GLOBAL LLC. PROTECTED BY FEDERATED PRIVACY TOKENS & HARDWARE LOCKS.</p>
        </footer>

      </div>
    );
  }

  return (
    <div id="nexus_app_root" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between overflow-x-hidden antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* GLOBAL TOAST ALERTER */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white rounded-lg px-4 py-3 shadow-xl border border-slate-700 flex items-center justify-between gap-3 animate-fade-in animate-duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <p className="text-xs font-mono tracking-normal leading-relaxed">{toastMessage}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-0.5 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* UPPER META BANNER */}
      <div className="bg-slate-900 text-slate-300 px-6 py-2 border-b border-slate-800 text-xs flex items-center justify-between flex-wrap gap-2 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="font-mono text-[10px] tracking-wider uppercase">V-CLUSTER SECURE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-70">
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Server Time: June 11, 2026</span>
          </div>
        </div>

        {/* Dynamic promotional news */}
        <div className="animate-pulse text-indigo-300 text-[11px] font-mono mx-auto hidden md:block">
          ⚡ Apply key **ENTERPRISE30** for immediate 30% reduction on smart biometric models.
        </div>

        {/* Global Selectors */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-[10px] opacity-70">VALUTA:</span>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-slate-800 border-none text-slate-200 text-xs rounded px-1.5 py-0.5 font-mono focus:ring-1 focus:ring-indigo-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] opacity-70">LANG:</span>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-800 border-none text-slate-200 text-xs rounded px-1.5 py-0.5 font-mono focus:ring-1 focus:ring-indigo-500"
            >
              <option value="EN">EN (US)</option>
              <option value="ES">ES (Europe)</option>
              <option value="FR">FR (French)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CORE PLATFORM HEADER */}
      <header id="nexus_platform_header" className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-30 transition-all duration-200 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('customer')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-md transform hover:rotate-3 transition duration-150">
              N
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-1">
                NEXUS<span className="text-indigo-600 font-light tracking-wider">CORE</span>
              </span>
              <p className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">Multi-Vendor AI Commerce Engine</p>
            </div>
          </div>

          {/* Navigation Control Roles */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { setActiveTab('customer'); setDetailedProduct(null); }}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'customer' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Customer Hub
            </button>
            <button 
              onClick={() => { setActiveTab('seller'); setDetailedProduct(null); }}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'seller' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Seller Deck
            </button>
            <button 
              onClick={() => { setActiveTab('admin'); setDetailedProduct(null); }}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Fraud & Admin Console
            </button>
          </nav>

          {/* User profile, cart and concierge widgets */}
          <div className="flex items-center gap-3">
            
            {/* Quick Profile Loyalty Point view */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden relative border border-slate-300">
                <img src={activeUser.avatar} alt="User bio avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-[11px]">{activeUser.firstName} {activeUser.lastName}</p>
                <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-600">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span>{activeUser.loyaltyPoints} Points</span>
                </div>
              </div>
            </div>

            {/* Secure Sign Out Button */}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setAuthOtpMode(false);
                setAuthOtpInput('');
                triggerToast('Session closed. Credentials securely cleared.');
              }}
              title="Secure Logout / Switch Profile"
              className="p-2 border border-slate-200 hover:border-red-200 rounded-lg text-slate-400 hover:text-red-500 bg-white hover:bg-red-50/50 transition duration-150"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* AI Concierge Float Button */}
            <button 
              onClick={() => setChatbotOpen(!chatbotOpen)} 
              title="Open AI Concierge Services"
              className="relative p-2.5 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
            >
              <Bot className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">AI</span>
            </button>

            {/* Shopping Basket button */}
            <button 
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                  {cart.reduce((tot, current) => tot + current.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile quick navigation rail */}
        <div className="flex lg:hidden mt-3 pt-2 border-t border-slate-100 items-center justify-around">
          <button 
            onClick={() => { setActiveTab('customer'); setDetailedProduct(null); }}
            className={`text-xs font-semibold py-1.5 px-3 rounded ${activeTab === 'customer' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
          >
            Customer Hub
          </button>
          <button 
            onClick={() => { setActiveTab('seller'); setDetailedProduct(null); }}
            className={`text-xs font-semibold py-1.5 px-3 rounded ${activeTab === 'seller' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
          >
            Seller Deck
          </button>
          <button 
            onClick={() => { setActiveTab('admin'); setDetailedProduct(null); }}
            className={`text-xs font-semibold py-1.5 px-3 rounded ${activeTab === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}
          >
            Admin Panel
          </button>
        </div>
      </header>

      {/* APPLICATION PERSISTENT NOTIFICATION HERO */}
      {checkoutSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-100 py-3 px-6 text-center text-xs text-emerald-800 font-mono transition-all">
          🎉 Trans-network packet settlement complete. Order **{orders[0]?.id || 'ORD_X'}** successfully verified. Total loyalty points updated instantly!
          <button className="underline ml-2 font-bold hover:text-emerald-950" onClick={() => setCheckoutSuccess(false)}>Dismiss</button>
        </div>
      )}

      {/* MAIN LAYOUT GATEWAY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 relative">
        
        {/* CUSTOMER HUB MODE */}
        {activeTab === 'customer' && !detailedProduct && (
          <div className="space-y-12">
            
            {/* PREMIUM ANIMATED HERO BANNER */}
            <section className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}></div>
              
              <div className="z-10 flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-none">Enterprise Marketplace Architecture</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
                  Bharat Bazaar & <br />
                  <span className="text-indigo-600 block mt-2">Next-Gen Marketplace</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed">
                  Discover premium 5G mobiles, authentic handloom attire, fresh regional groceries, and premium home appliances sourced directly from India's top trusted distributors.
                </p>
                
                {/* Micro tech grid */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                    <p className="text-lg font-bold text-slate-800">100%</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Genuine Brands</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                    <p className="text-lg font-bold text-slate-800">FREE</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Pan-India Deli</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                    <p className="text-lg font-bold text-slate-800">OTP</p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Secure Checkout</p>
                  </div>
                </div>
              </div>

              {/* Showcase Hero Slide card */}
              <div className="flex-1 w-full flex justify-center relative">
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full max-w-sm shadow-inner relative group">
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full animate-bounce">
                    Featured Pick
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=620" 
                    alt="OnePlus 12 5G smartphone" 
                    className="w-full h-44 object-scale-down rounded-lg mb-4 mix-blend-multiply group-hover:scale-105 transition"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-800">OnePlus 12 5G (Flowy Emerald)</h3>
                    <p className="text-xs text-slate-400">Snapdragon 8 Gen 3 & Hasselblad portrait cameras.</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-xs">₹66,717 base</span>
                      <button 
                        onClick={() => setDetailedProduct(mockProducts[0])}
                        className="text-xs text-white bg-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-800 font-medium transition"
                      >
                        Procure View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTIONS LAYOUT: Left Filters Sidebar, Right Products */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* FILTERS PANEL */}
              <aside className="w-full lg:w-64 shrink-0 space-y-6">
                
                {/* Smart Search Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-3">Active Smart Search</h3>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type e.g., 'watch', 'parka'..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 font-sans border border-slate-200 rounded-lg text-xs py-2.5 pl-8 pr-3 text-slate-800 font-normal focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Active Intent telemetry */}
                  {detectedSearchIntent && (
                    <div className="mt-3 bg-indigo-50/60 p-2.5 rounded border border-indigo-150 text-[10px] font-mono text-indigo-900">
                      <p className="font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-600 shrink-0" /> Intent Target Classifier:</p>
                      <p className="mt-0.5 font-light">{detectedSearchIntent}</p>
                    </div>
                  )}

                  {/* Quick Auto-complete Suggestions box */}
                  {searchSuggestions.length > 0 && (
                    <div className="mt-3 bg-white border border-slate-200 rounded-lg shadow-md absolute left-0 right-0 p-2 z-20 space-y-1">
                      <p className="text-[9px] font-mono text-slate-400 uppercase px-1 leading-snug">Catalog match suggestions</p>
                      {searchSuggestions.map(suggest => (
                        <div 
                          key={suggest.id} 
                          onClick={() => { setSearchQuery(suggest.name); }}
                          className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer transition text-xs"
                        >
                          <span className="text-slate-700 font-medium truncate">{suggest.name}</span>
                          <span className="text-slate-400 font-mono text-[9px] select-none ml-auto">Click fill</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories selector */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-3">Filter Categories</h3>
                  <div className="space-y-1">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${selectedCategory === null ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Compartments
                    </button>
                    {mockCategories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range controls */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-400 uppercase">Ceiling Valuation</span>
                    <span className="font-mono text-indigo-600 font-bold">{formatPrice(selectedPriceRange)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="25"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                    className="w-full accent-indigo-600 bg-slate-100 h-2.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-slate-400">
                    <span>{formatPrice(50)}</span>
                    <span>{formatPrice(250)}</span>
                    <span>{formatPrice(500)}</span>
                  </div>
                </div>

                {/* Toggle AI curation criteria */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">Curation Filter</h4>
                    <p className="text-[10px] text-slate-400">Strict AI Core Recommendations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={onlyAiRecommended} 
                      onChange={() => setOnlyAiRecommended(!onlyAiRecommended)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                 {/* Dynamic Loyalty program sharing hub */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-300 uppercase tracking-widest leading-none">Bazaar Reward Coins</span>
                    <h4 className="text-sm font-bold mt-1">{activeUser.referralCode.toLowerCase()} invites</h4>
                    <p className="text-[11px] text-indigo-200 mt-1 leading-snug">Invite friends to join the leading Bharat Bazaar marketplace. Both obtain 150 reward coins instantly.</p>
                  </div>
                  
                  {/* Share button widget */}
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="text" 
                      readOnly 
                      value={activeUser.referralCode}
                      className="w-full bg-slate-800 border-none rounded text-[10px] font-mono tracking-wider py-1 px-1.5 text-indigo-300 text-center select-all focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <button 
                      onClick={copyReferralCode}
                      className="p-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 rounded text-[10px] font-medium transition cursor-pointer shrink-0"
                    >
                      {copiedReferral ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>

                  {/* Redeem prompt input */}
                  <div className="pt-2 border-t border-indigo-800/80 space-y-2">
                    <p className="text-[10px] text-indigo-200">Referred by someone?</p>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE" 
                        value={referralCodeInput}
                        onChange={(e) => setReferralCodeInput(e.target.value)}
                        className="w-full bg-indigo-950 border border-indigo-800 rounded text-[10px] font-mono text-white tracking-wider px-2 py-1 placeholder:text-indigo-400"
                      />
                      <button 
                        onClick={handleApplyReferral}
                        className="bg-white text-indigo-950 font-bold px-2 py-1 rounded text-[10px] hover:bg-indigo-100 transition"
                      >
                        PROVE
                      </button>
                    </div>
                    {referredBySuccess && (
                      <p className="text-[9px] font-mono text-emerald-400">✔ Linked referral: {referredBySuccess}</p>
                    )}
                  </div>
                </div>

                {/* Technical System Status sidebar footer indicator */}
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200/60 text-center">
                  <div className="flex justify-center items-center gap-1 text-[9px] font-mono tracking-wide text-slate-500 uppercase leading-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PostgreSQL 16 SYNC: ✔ OK</span>
                  </div>
                </div>

              </aside>

              {/* PRODUCTS LISTING CONTAINER */}
              <div className="flex-1 space-y-6">
                
                {/* Result count & sorting */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <p className="text-xs text-slate-400">
                    Displaying <strong className="font-bold text-slate-800">{filteredProducts.length}</strong> distinctive multi-vendor items matching current config.
                  </p>
                  
                  {/* Sorting dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Sort Order:</span>
                    <select 
                      value={sortingOption}
                      onChange={(e) => setSortingOption(e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* If no items found */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                    <div>
                      <h3 className="font-bold text-slate-800">No architectural items fit filters.</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try widening the pricing range slider or clear search words to update live state queries.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                        setSelectedPriceRange(500);
                        setSelectedSeller(null);
                        setOnlyAiRecommended(false);
                      }}
                      className="text-xs text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2 rounded-lg transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* PRODUCT BENTO GRID CARD DISPLAY */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const sellerObj = mockSellers.find(s => s.id === product.sellerId);
                    const originalPriceDiscounted = product.currentDiscount 
                      ? Math.round(product.basePrice * (1 - product.currentDiscount / 100))
                      : product.basePrice;

                    return (
                      <article 
                        key={product.id}
                        id={`card_${product.id}`}
                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group"
                      >
                        {/* Image stage */}
                        <div className="bg-slate-50 p-4 h-48 relative flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-100" onClick={() => setDetailedProduct(product)}>
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                            {product.isAiRecommended && (
                              <span className="bg-indigo-600 text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-2.5 h-2.5" /> AI RECOMMENDED
                              </span>
                            )}
                            {product.currentDiscount && (
                              <span className="bg-red-500 text-white text-[8px] font-mono tracking-normal px-2 py-0.5 rounded-full font-bold shadow-xs">
                                {product.currentDiscount}% DISCOUNT
                              </span>
                            )}
                          </div>

                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-full w-auto object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Title details */}
                        <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            {/* Seller & Category info */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                              <span className="hover:underline cursor-pointer font-bold tracking-wider text-slate-500" onClick={() => setSelectedSeller(product.sellerId)}>
                                {sellerObj ? sellerObj.companyName : 'V-Partner'}
                              </span>
                              <span>•</span>
                              <span>{mockCategories.find(c => c.id === product.categoryId)?.name || 'E-Com'}</span>
                            </div>

                            <h3 
                              onClick={() => setDetailedProduct(product)}
                              className="font-bold text-slate-900 group-hover:text-indigo-600 transition duration-100 text-sm tracking-tight cursor-pointer leading-snug line-clamp-2"
                            >
                              {product.name}
                            </h3>
                          </div>

                          {/* Ratings and dynamic analytical sentiment count */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-slate-800">{product.averageRating}</span>
                              <span className="text-slate-400 text-[10px]">({product.reviewCount} inspections)</span>
                            </div>

                            {/* Verification Tag */}
                            {sellerObj?.isVerified && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 tracking-wider font-mono border border-emerald-100 py-0.5 px-1.5 rounded uppercase leading-none">Verified Supplier</span>
                            )}
                          </div>

                          {/* Pricing block and buy actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              {product.currentDiscount ? (
                                <div className="space-y-0.5">
                                  <p className="text-xs text-slate-400 line-through leading-none">{formatPrice(product.basePrice)}</p>
                                  <p className="text-base font-extrabold text-indigo-700 font-mono tracking-tight">{formatPrice(originalPriceDiscounted)}</p>
                                </div>
                              ) : (
                                <p className="text-base font-extrabold text-slate-850 font-mono tracking-tight">{formatPrice(product.basePrice)}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Open detail view */}
                              <button 
                                onClick={() => setDetailedProduct(product)}
                                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition"
                                title="Inspect dynamic variant specifications"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>

                              {/* Instantly buy with first variant */}
                              <button 
                                onClick={() => {
                                  const vars = mockProductVariants.filter(v => v.productId === product.id);
                                  const targetVar = vars[0]?.id || 'default';
                                  addToCart(product.id, targetVar);
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition"
                              >
                                Procure
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* CUSTOMER FAQs BENTO CARD BLOCK */}
                <section className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xs font-mono font-black tracking-widest text-slate-400 uppercase mb-4">Multi-Vendor Operating Guarantee</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Decentralized Logistics
                      </p>
                      <p>Sellers dispatch circular commodities via certified low-emission carbon offsets network directly from their localized fulfillment yards.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <Percent className="w-4 h-4 text-indigo-600" /> Dynamic Price Elasticity
                      </p>
                      <p>Prices balance transparently to reflect demand fluctuations, competitor averages, and raw material availability indexes calculated hourly by AI models.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <Award className="w-4 h-4 text-amber-500 animate-spin" /> Escrow Security Settled
                      </p>
                      <p>Funds clear in secure transactional staging wallets pending receipt confirmation of standard biochemical smart parameters.</p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        )}

        {/* CUSTOMER HUB: COMPREHENSIVE PRODUCT DETAIL VIEW MODAL */}
        {activeTab === 'customer' && detailedProduct && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md animate-fade-in">
            {/* Header navigator */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 py-3.5 flex items-center justify-between">
              <nav className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-700 transition">
                <button onClick={() => setDetailedProduct(null)} className="hover:underline flex items-center gap-1">
                  <span>Customer Catalogue</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-slate-750 max-w-xs truncate">{detailedProduct.name}</span>
              </nav>
              <button 
                onClick={() => setDetailedProduct(null)} 
                className="p-1 px-3 bg-slate-200/60 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
              >
                Back To Store
              </button>
            </div>

            {/* Split layout: Specs & gallery */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Image and dynamic thumbnails */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 h-80 flex items-center justify-center relative">
                  
                  {detailedProduct.currentDiscount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-[9px] font-mono tracking-normal py-0.5 px-2 rounded font-bold shadow-xs">
                      {detailedProduct.currentDiscount}% PRICE DROP OFF
                    </span>
                  )}

                  <img 
                    src={detailedProduct.images[activeImageIdx] || detailedProduct.images[0]} 
                    alt={detailedProduct.name} 
                    className="h-full w-auto object-contain mix-blend-multiply transition duration-200"
                  />
                </div>

                {/* Thumbnails list */}
                {detailedProduct.images.length > 1 && (
                  <div className="flex gap-3 justify-center">
                    {detailedProduct.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImageIdx(i)}
                        className={`w-14 h-14 bg-slate-50 border rounded-lg p-1.5 transition ${activeImageIdx === i ? 'border-indigo-600 ring-2 ring-indigo-50/50' : 'border-slate-200 hover:border-slate-400'}`}
                      >
                        <img src={img} alt="Spec micro thumb" className="w-full h-full object-scale-down mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Frequently Bought Together Bundle block */}
                <div className="bg-gradient-to-r from-indigo-50/70 to-slate-50 border border-indigo-100 p-4 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-900 font-bold">
                    <Sparkles className="w-4 h-4 text-indigo-700" />
                    <span>Frequently Procured Together Bundle</span>
                  </div>
                  <div className="flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded p-1 flex-shrink-0">
                        <img 
                          src={products.find(p => p.id !== detailedProduct.id)?.images[0]} 
                          alt="Dynamic bundled addition" 
                          className="w-full h-full object-scale-down mix-blend-multiply" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[150px]">{products.find(p => p.id !== detailedProduct.id)?.name}</p>
                        <p className="text-[10px] text-slate-400">Regular discount rate applied</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const extraProd = products.find(p => p.id !== detailedProduct.id);
                        if (extraProd) {
                          const vars = mockProductVariants.filter(v => v.productId === extraProd.id);
                          addToCart(extraProd.id, vars[0]?.id || 'default');
                        }
                      }}
                      className="bg-indigo-600 text-white rounded font-medium px-2 py-1 text-[10px] hover:bg-indigo-700 shrink-0 transition"
                    >
                      + ADD BUNDLE
                    </button>
                  </div>
                </div>

              </div>

              {/* SPECIFICATION CARD CONTENT */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Meta vendor reference */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5 font-bold tracking-wider">
                      Seller Portfolio ID: {detailedProduct.sellerId}
                    </span>
                    {detailedProduct.isAiRecommended && (
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-emerald-600" /> AI Ranked Spec
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{detailedProduct.name}</h2>
                  <p className="text-xs text-slate-400 leading-none">
                    Multi-Vendor certified and secured under standard SaaS smart-escrow codes.
                  </p>
                </div>

                {/* Rating score card */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(st => (
                      <Star 
                        key={st} 
                        className={`w-4 h-4 ${st <= Math.round(detailedProduct.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{detailedProduct.averageRating} star score</span>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={() => {
                      setChatbotOpen(true);
                      handleSendChatbotMessage(`Tell me special tech benefits about ${detailedProduct.name}`);
                    }}
                    className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Bot className="w-3.5 h-3.5" /> Speak with AI Concierge about this product
                  </button>
                </div>

                {/* Description paragraphs */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {detailedProduct.description}
                </p>

                {/* Dynamic Variants selectors */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-tight text-slate-800">Available Specifications & Variants</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Inventory Real-time counts</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {detailedProductVariants.map(v => {
                      const isLowStock = v.stock <= 5;
                      const displayPriceForVariant = detailedProduct.currentDiscount 
                        ? Math.round(v.price * (1 - detailedProduct.currentDiscount / 100))
                        : v.price;

                      return (
                        <div 
                          key={v.id}
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${selectedVariantId === v.id ? 'border-indigo-600 bg-white ring-2 ring-indigo-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="text-xs font-bold text-slate-800">
                              {v.color || 'Standard'} {v.size ? `• size ${v.size}` : ''} {v.material ? `• ${v.material}` : ''}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">{v.sku}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100">
                            <span className="font-mono text-xs font-bold text-indigo-700">{formatPrice(displayPriceForVariant)}</span>
                            {isLowStock ? (
                              <span className="text-[9px] font-mono text-amber-600 bg-amber-50 border border-amber-100 px-1 py-0.5 rounded tracking-tight">⚠️ Crit Low Stock ({v.stock})</span>
                            ) : (
                              <span className="text-[9px] font-mono text-slate-400 bg-slate-200 px-1 py-0.5 rounded">In stock ({v.stock})</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tech specifications Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Parametric Specifications Ledger</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {Object.entries(detailedProduct.specs).map(([label, value], idx) => (
                      <div key={label} className={`flex border-b border-slate-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <div className="w-1/3 p-3 font-mono font-bold text-slate-500 bg-slate-100/30">{label}</div>
                        <div className="w-2/3 p-3 text-slate-700">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button active trigger */}
                <div className="pt-4 flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (selectedVariantId) {
                        addToCart(detailedProduct.id, selectedVariantId);
                      }
                    }}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add Active Selected Variant to Procurement Cart
                  </button>
                  <button 
                    onClick={() => {
                      // Apply immediate checkout
                      if (selectedVariantId) {
                        addToCart(detailedProduct.id, selectedVariantId);
                        setCartOpen(true);
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm shadow-sm transition"
                  >
                    Instant Checkout
                  </button>
                </div>

                {/* ACTIVE VERIFIED REVIEWS MODULE */}
                <div className="pt-8 border-t border-slate-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-950 text-sm">Inspections & Automated Sentiment Analyses</h3>
                      <p className="text-[10px] text-slate-400">Verifies transaction legitimacy and detects potential bot spam scripts.</p>
                    </div>
                    <span className="text-xs font-mono text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-1 rounded">
                      ✔ {detailedProductReviews.filter(r => !r.isFlaggedFake).length} Verified Legitimate
                    </span>
                  </div>

                  {/* Submit review comment Form */}
                  <form onSubmit={handleAnalyzeAndSubmitReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">Draft Custom Inspection Review</label>
                      
                      {/* Rating select stars tool */}
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 select-none">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Rating:</span>
                        {[1, 2, 3, 4, 5].map(st => (
                          <button 
                            type="button" 
                            key={st} 
                            onClick={() => setNewReviewRating(st)}
                            className="p-0.5 hover:scale-110 transition"
                          >
                            <Star className={`w-3.5 h-3.5 ${st <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea 
                        rows={2}
                        placeholder="Write comments... (e.g. 'Spectacular holographic glass', or uppercase clickbait code blocks to test AI fraud radar)"
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl text-xs py-2.5 px-3 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 font-sans leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-slate-400 flex items-center gap-1 max-w-[200px] leading-snug">
                        <Bot className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        Submissions analyzed automatically by analytical APIs for spam patterns.
                      </p>
                      <button 
                        type="submit"
                        disabled={isAnalyzingReview || !newReviewComment.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isAnalyzingReview ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Analyzing Pattern...
                          </>
                        ) : (
                          <>
                            Submit Review Comment & AI Analyze
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Dynamic analyzed metrics summary after review submission */}
                  {reviewAnalysisResult && (
                    <div className="p-4 rounded-xl border bg-slate-900 text-slate-100 space-y-2 animate-fade-in text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="text-indigo-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI SENTIMENT & RISK METRICS REPORT</span>
                        <span className="text-slate-400 text-[10px]">VERIFIED OK_200</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400">POLARITY:</p>
                          <p className={`font-bold capitalize text-sm ${reviewAnalysisResult.sentiment === 'positive' ? 'text-emerald-400' : reviewAnalysisResult.sentiment === 'negative' ? 'text-rose-400' : 'text-amber-400'}`}>
                            {reviewAnalysisResult.sentiment} ({Math.round(reviewAnalysisResult.confidence * 100)}% Confidence)
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400">FRAUD ALERT STATUS:</p>
                          <p className={`font-bold text-xs ${reviewAnalysisResult.isFlaggedFake ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                            {reviewAnalysisResult.isFlaggedFake ? '🚨 HIGH PROBABILITY AUTOMATION SPAM' : 'PASS (Legitimate transactional curve)'}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800">
                        <p className="text-[10px] text-slate-400">SYSTEM EXPLANATION DICTIONARY:</p>
                        <p className="text-slate-200 select-all">{reviewAnalysisResult.aiReviewSummary}</p>
                      </div>
                    </div>
                  )}

                  {/* Render list of reviews */}
                  <div className="space-y-4">
                    {detailedProductReviews.map(review => (
                      <div key={review.id} className="p-4 bg-white rounded-2xl border border-slate-200 relative group space-y-2">
                        
                        {/* Spam Warning badge */}
                        {review.isFlaggedFake && (
                          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-2.5 text-[11px] flex gap-2 items-start">
                            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <p className="font-bold font-mono">SYSTEM WARNING: FLAG AUTOMATION SPAM RADAR</p>
                              <p className="text-slate-500 font-sans leading-relaxed">{review.aiReviewSummary || 'Uppercase clickbait formatting detected by heuristic engines.'}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-start gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800">{review.userName}</span>
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                              <span>Rating: {review.rating}/5</span>
                              <span>•</span>
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                              {review.isVerifiedPurchase && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-[9px] bg-emerald-50 border border-emerald-100 rounded px-1">Verified Buyer</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Sentiment Tag analysis summary */}
                          {review.sentiment && (
                            <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase ${review.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-700' : review.sentiment === 'negative' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                              Sentiment: {review.sentiment}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-sans">{review.comment}</p>

                        {/* Helpful Votes support counter */}
                        <div className="flex items-center gap-2 pt-1">
                          <button 
                            onClick={() => {
                              setReviews(prev => prev.map(r => r.id === review.id ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r));
                              triggerToast('Thanks for audit vote endorsement!');
                            }}
                            className="text-[10px] text-slate-400 bg-slate-50 border hover:bg-slate-100 px-2 py-1 rounded transition flex items-center gap-1 cursor-pointer"
                          >
                            <TrendingUp className="w-3 h-3 text-indigo-500" /> Helpful ({review.helpfulVotes})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* SELLER DECK TAB: PRICING ENGINE & SALES FORECASTS */}
        {activeTab === 'seller' && (
          <div className="space-y-8 animate-fade-in">
            
            <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-black">Multi-Vendor Control Center</span>
                <h2 className="text-3xl font-black text-white tracking-tight">Active Vendor Catalog Portal</h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Toggle pricing parameters, check competitive index pricing of listings across Amazon or Meesho, and trigger real-time neural forecasts on inventory life spans.
                </p>
              </div>

              {/* Stats dashboard cells */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Gross Revenue Settlements</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">$14,845</p>
                  <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% month sequence
                  </span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Total Items Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">{products.length}</p>
                  <span className="text-[9px] font-mono text-slate-400 mt-1">3 Vendors Connected</span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Average Supplier Rating</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-400 mt-1">4.61 ★</p>
                  <span className="text-[9px] font-mono text-indigo-300 mt-1">Industry standard threshold: 4.2</span>
                </div>
                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">SaaS System Commission</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">1.8% Net</p>
                  <span className="text-[9px] font-mono text-indigo-400 mt-1">Guarantees escrow safety</span>
                </div>
              </div>
            </section>

            {/* SELLER FLOWS: Choose a product, evaluate and update price */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product selector & AI dynamic pricing controller */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-lg">AI Dynamic Pricing Optimizer</h3>
                  <p className="text-xs text-slate-400">Optimize vendor pricing margins automatically based on real-time competitor indexes, recent sales velocities, and dynamic seasonal demand variables.</p>
                </div>

                {/* Select product item to test pricing optimization */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select Catalog Item to Analyze</label>
                  <select 
                    value={selectedSellerProductPriceOptId}
                    onChange={(e) => {
                      setSelectedSellerProductPriceOptId(e.target.value);
                      setCalculatedPriceSuggestion(null);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-850 text-xs rounded-xl p-3 focus:ring-1 focus:ring-indigo-500"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — Current Base Price: {formatPrice(p.basePrice)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optimization analysis triggers buttons */}
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-850">Trigger neural catalog alignment check</p>
                    <p className="text-[10px] text-slate-400">Evaluates live demand multiplier indices for this SKU.</p>
                  </div>
                  <button 
                    onClick={() => triggerPriceOptimization(selectedSellerProductPriceOptId)}
                    disabled={optimizingPrice}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {optimizingPrice ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching multi-data...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Calculate Optimized Pricing with AI
                      </>
                    )}
                  </button>
                </div>

                {/* Display recommendations if calculated */}
                {calculatedPriceSuggestion && (
                  <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-4 font-mono text-xs animate-fade-in border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-indigo-400 flex items-center gap-1 font-bold">
                        <TrendingUp className="w-3.5 h-3.5" /> DYNAMIC CATALOG OPTIMIZER SUGGESTIONS
                      </span>
                      <span className="text-indigo-300 font-normal">SKU ALIGNED</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-[9px] text-slate-400">CURRENT BASE:</p>
                        <p className="text-sm font-bold text-slate-200 mt-1">
                          {formatPrice(products.find(p => p.id === selectedSellerProductPriceOptId)?.basePrice || 100)}
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-950 rounded-lg border border-indigo-900">
                        <p className="text-[9px] text-indigo-400">AI OPTIMIZED RECOMMENDATION:</p>
                        <p className="text-base font-black text-indigo-300 mt-0.5">
                          {formatPrice(calculatedPriceSuggestion.optimizedPrice)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-800 rounded-lg">
                        <p className="text-[9px] text-slate-300">DEMAND BIAS:</p>
                        <p className="text-sm font-bold text-amber-400 mt-1">
                          {calculatedPriceSuggestion.demandFactor}x Multiplier
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 bg-slate-800 p-3 rounded-lg leading-relaxed">
                      <p className="text-[9px] text-slate-400 font-bold uppercase uppercase tracking-wider">Algorithmic Justification:</p>
                      <p className="text-slate-200 font-sans text-xs">{calculatedPriceSuggestion.justification}</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button 
                        onClick={() => setCalculatedPriceSuggestion(null)}
                        className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] transition cursor-pointer"
                      >
                        Decline Suggestions
                      </button>
                      <button 
                        onClick={applyPriceOptimization}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] transition cursor-pointer"
                      >
                        Apply AI Optimized Price to Catalog Live!
                      </button>
                    </div>
                  </div>
                )}

                {/* Seller product listing overview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Operational Product Listings</h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    {products.map(p => {
                      const vArr = mockProductVariants.filter(v => v.productId === p.id);
                      const totStock = vArr.reduce((tot, cu) => tot + cu.stock, 0);

                      return (
                        <div key={p.id} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition">
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Catalog listing: {p.id} | Total stock: {totStock}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-indigo-700">{formatPrice(p.basePrice)}</p>
                            <button 
                              onClick={() => {
                                setSelectedSellerProductPriceOptId(p.id);
                                triggerPriceOptimization(p.id);
                              }}
                              className="text-[10px] text-indigo-600 font-medium hover:underline cursor-pointer"
                            >
                              Analyze Pricing Price
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* DEMAND FORECASTS & RETENTION ENGINE */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-lg">AI Demand Forecaster</h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      Leverage historical procurement metrics to predict upcoming monthly material demand trends and evaluate customer retention churn vulnerabilities.
                    </p>
                  </div>

                  {/* Forecaster Trigger */}
                  <div className="py-4">
                    <button 
                      onClick={triggerDemandForecaster}
                      disabled={forecastingDemand}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg text-xs tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {forecastingDemand ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying Predictive Nodes...
                        </>
                      ) : (
                        <>
                          <Bot className="w-4 h-4 text-indigo-400" /> Run Predictive AI Forecast Report
                        </>
                      )}
                    </button>
                  </div>

                  {/* Render Forecast Result */}
                  {forecastResult ? (
                    <div className="space-y-4 animate-fade-in">
                      
                      {/* Interactive Meters */}
                      <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-4 text-xs font-mono">
                        <div className="space-y-1.5">
                          <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
                            <span>Predicted Monthly Velocity:</span>
                            <span className="text-slate-800">{forecastResult.predictedDemandUnits} units model</span>
                          </div>
                          {/* Visual CSS bar */}
                          <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: '74%' }}></div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase">
                            <span>SaaS Retention Level:</span>
                            <span className="text-slate-800">{Math.round(forecastResult.retentionScore * 100)}% Index score</span>
                          </div>
                          {/* Visual CSS bar */}
                          <div className="bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${forecastResult.retentionScore * 100}%` }}></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-white p-2 text-[10px] rounded border border-slate-150">
                          <span className="text-slate-400 uppercase">Churn Retention level Flag:</span>
                          <span className={`font-black uppercase tracking-wider ${forecastResult.isHighChurnRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {forecastResult.isHighChurnRisk ? '⚠️ High Risk Segment' : '✔ Normal Retention'}
                          </span>
                        </div>
                      </div>

                      {/* Text Summary */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-xs">
                        <p className="font-bold text-slate-700 font-mono text-[10px] uppercase">Trajectory Abstract:</p>
                        <p className="text-slate-500 font-sans text-[11px] mt-1 leading-relaxed">
                          {forecastResult.forecastSummary}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs space-y-2">
                      <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
                      <p className="text-slate-400 font-sans max-w-xs mx-auto">Click "Run Predictive AI Forecast Report" to initiate predictive calculations on database vectors.</p>
                    </div>
                  )}
                </div>

                {/* Seller guidelines */}
                <div className="pt-4 border-t border-slate-150 text-[11px] text-slate-400 leading-normal font-sans space-y-1 mt-6">
                  <p className="font-bold text-slate-500 text-[10px] font-mono uppercase tracking-wider">Multi-Vendor SaaS Terms:</p>
                  <p>In accordance with standard enterprise bylaws, catalog items must abide by ethical carbon footprint metrics to qualify for active smart search indexing visibility.</p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ADMIN TAB VIEW PANEL */}
        {activeTab === 'admin' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header statistics strip */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Fraud & Trust Console</h2>
                <p className="text-xs text-slate-400">Review platform integrity thresholds, verify partner vendors, and moderate flagged customer engagement profiles.</p>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div className="bg-slate-50 px-3 py-2 rounded-lg text-center border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">DB LATENCY</span>
                  <span className="text-sm font-bold text-emerald-600">14ms API</span>
                </div>
                <div className="bg-slate-50 px-3 py-2 rounded-lg text-center border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SYSTEM FLAG ACTIONS</span>
                  <span className="text-sm font-bold text-indigo-600">Active Sec</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Flagged Spam Review Radar */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-slate-900 text-base">Real-Time Threat & Bot Spam Radar</h3>
                    <p className="text-xs text-slate-400">Heuristic AI pattern checkers flag repetitive capital text review bots.</p>
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 bg-rose-50 border border-rose-100 rounded px-2 py-0.5 uppercase tracking-wide">
                    {reviews.filter(r => r.isFlaggedFake).length} Threat Warnings
                  </span>
                </div>

                {/* Loop of flagged fake reviews */}
                <div className="space-y-4">
                  {reviews.filter(r => r.isFlaggedFake).map((badRev) => (
                    <div key={badRev.id} className="p-4 bg-red-50/70 border border-red-200 rounded-2xl relative space-y-2">
                      <div className="flex justify-between items-start flex-wrap gap-2 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-red-950 flex items-center gap-1">
                            <ShieldAlert className="w-4 h-4 text-red-600" /> Automated Bot Spam Flag Detected
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Reporter user: {badRev.userName} | Target Item id: {badRev.productId}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-red-100 text-red-800 tracking-wider font-bold rounded px-1.5 py-0.5">
                          Heuristic Flagged
                        </span>
                      </div>

                      <p className="text-xs text-slate-650 font-mono pl-3 border-l-2 border-red-300 italic">
                        "{badRev.comment}"
                      </p>

                      <div className="pt-2 border-t border-red-200/50 flex justify-between items-center text-xs">
                        <p className="text-[10px] text-slate-400 font-mono">Audit comment: {badRev.aiReviewSummary}</p>
                        <button 
                          onClick={() => {
                            setReviews(prev => prev.filter(r => r.id !== badRev.id));
                            triggerToast('Review block deleted from PostgreSQL schema successfully!');
                          }}
                          className="text-red-700 hover:text-white hover:bg-red-600 border border-red-200 px-3 py-1 rounded text-[10px] transition cursor-pointer"
                        >
                          Permanently Purge
                        </button>
                      </div>
                    </div>
                  ))}

                  {reviews.filter(r => r.isFlaggedFake).length === 0 && (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl text-xs space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="font-bold text-slate-800">Clear database threat logs.</p>
                      <p className="text-slate-400">All currently active user review commentaries comply safe heuristics standards.</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Platform Sellers verification Panel */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">Multi-Vendor Accounts</h3>
                  <p className="text-xs text-slate-400">Moderate seller profile verified statuses on storefront.</p>
                </div>

                <div className="space-y-4">
                  {mockSellers.map(seller => (
                    <div key={seller.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <img src={seller.logo} alt="Seller cover logo" className="w-8 h-8 rounded object-cover" />
                        <div className="space-y-0.5 text-xs">
                          <p className="font-bold text-slate-900">{seller.companyName}</p>
                          <p className="text-[10px] font-mono text-indigo-600">Company ID: {seller.id}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-250 text-xs">
                        <span className="text-[10px] font-mono text-slate-400">Rating: {seller.rating}★</span>
                        
                        {seller.isVerified ? (
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono px-1 rounded uppercase">✔ Storefront Active</span>
                        ) : (
                          <button 
                            onClick={() => {
                              seller.isVerified = true;
                              triggerToast(`${seller.companyName} verification verified permanently!`);
                            }}
                            className="bg-indigo-600 text-white font-bold py-1 px-2.5 rounded text-[10.5px] hover:bg-indigo-700 transition cursor-pointer"
                          >
                            Grant Verification Status
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* CORE CHATBOT DRAWER CONCIERGE PANEL */}
      {chatbotOpen && (
        <div id="nexus_chatbot_panel" className="fixed bottom-0 right-0 sm:right-6 w-full sm:w-96 h-[500px] bg-white border border-slate-200 shadow-2xl rounded-t-3xl sm:rounded-3xl pointer-events-auto z-50 flex flex-col justify-between overflow-hidden animate-fade-in">
          
          {/* Panel Header */}
          <header className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2 bg-indigo-600 rounded text-xs shrink-0 font-bold">AI</div>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-tight">Nexus Commerce Concierge</h3>
                <p className="text-[9px] text-indigo-300 uppercase tracking-widest flex items-center gap-1 leading-none mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> @google/genai Model Stable
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setChatbotOpen(false)} 
              className="text-slate-400 hover:text-white p-1 rounded transition"
              title="Close chat concierge"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Quick starter questions triggers */}
          <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex gap-1.5 items-center overflow-x-auto whitespace-nowrap scrollbar-none text-[10px] select-none">
            <span className="text-slate-400 font-mono text-[9px] uppercase">FAVORITES:</span>
            <button 
              onClick={() => handleSendChatbotMessage('Is the OnePlus 12 5G currently in stock?')}
              className="bg-white border rounded px-2 py-0.5 hover:bg-slate-50 transition"
            >
              OnePlus 12 5G Stock
            </button>
            <button 
              onClick={() => handleSendChatbotMessage('Are there active coupon codes available for checkout?')}
              className="bg-white border rounded px-2 py-0.5 hover:bg-slate-50 transition"
            >
              Examine Coupons
            </button>
            <button 
              onClick={() => handleSendChatbotMessage('Which pure handloom cotton Kurtas are available?')}
              className="bg-white border rounded px-2 py-0.5 hover:bg-slate-50 transition"
            >
              Handloom Kurtas
            </button>
          </div>

          {/* Messages list container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
            {chatMessages.map((msg, idx) => {
              const matchesBot = msg.role === 'model';
              return (
                <div key={msg.id || idx} className={`flex ${matchesBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 max-w-[85%] rounded-2xl leading-relaxed shadow-xs ${matchesBot ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                    <p className="break-words" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              );
            })}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="font-mono text-[10px]">Processing model tokens...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat input box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendChatbotMessage(); }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center"
          >
            <input 
              type="text" 
              placeholder="Ask anything about the multi-vendor catalog..."
              value={chatbotInput}
              onChange={(e) => setChatbotInput(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <button 
              type="submit" 
              disabled={!chatbotInput.trim() || chatLoading}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* CORE SECURE CART & CHECKOUT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end animate-fade-in pointer-events-auto">
          <div className="w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-in">
            
            {/* Drawer Header */}
            <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Procurement Basket Ledger</h3>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* OTP AUTHENTICATION CODE VERIFIER MODE */}
            {otpMode ? (
              <div className="flex-grow p-6 flex flex-col justify-center space-y-6 bg-slate-50 text-xs">
                <div className="text-center space-y-2">
                  <ShieldCheck className="w-12 h-12 text-indigo-600 mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-slate-900 font-mono tracking-tight">Two-Factor OTP Security Token Required</h4>
                  <p className="text-slate-500 leading-normal max-w-xs mx-auto">
                    To authorize checkout parameters safely under standard security regulations, verify authorization using OTP security code.
                  </p>
                  <p className="text-[10px] text-indigo-600 font-mono font-bold bg-indigo-50 border border-indigo-100 rounded p-1 inline-block">
                    PROVE SECURITY KEY: **2026** or **1234**
                  </p>
                </div>

                <form onSubmit={handleVerifyOtpCode} className="space-y-4 max-w-xs mx-auto w-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block text-center">4-Digit Security Authorization Phrase</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      placeholder="••••"
                      value={otpInput}
                      onChange={(e) => { setOtpInput(e.target.value); setOtpError(''); }}
                      className="w-full bg-white border border-slate-200 text-center rounded-xl py-3 text-lg tracking-[0.5em] focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    {otpError && (
                      <p className="text-[10px] font-mono text-red-600 text-center">{otpError}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setOtpMode(false)}
                      className="flex-1 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
                    >
                      Verify & Settle
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // ITEMS LIST OR EMPTY BASKET
              <>
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs">
                  {cart.map((item) => {
                    const matchedProd = products.find(p => p.id === item.productId);
                    const matchedVariant = mockProductVariants.find(v => v.id === item.variantId);
                    if (!matchedProd || !matchedVariant) return null;

                    const activeDisPrice = matchedProd.currentDiscount 
                      ? Math.round(matchedVariant.price * (1 - matchedProd.currentDiscount / 100))
                      : matchedVariant.price;

                    return (
                      <div key={item.variantId} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                        {/* Display check photo */}
                        <img 
                          src={matchedProd.images[0]} 
                          alt={matchedProd.name} 
                          className="w-12 h-12 object-scale-down rounded bg-slate-50 p-1 flex-shrink-0" 
                        />
                        
                        <div className="flex-grow space-y-0.5">
                          <p className="font-bold text-slate-850 truncate max-w-[150px]">{matchedProd.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono">
                            Color: {matchedVariant.color || 'Default'} {matchedVariant.size ? `[${matchedVariant.size}]` : ''}
                          </p>
                          <p className="font-mono text-indigo-700 font-bold">{formatPrice(activeDisPrice)} each</p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border">
                            <button 
                              onClick={() => updateCartQty(item.variantId, -1)}
                              className="p-1 hover:bg-white rounded text-slate-600 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-1.5 text-xs font-bold font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.variantId, 1)}
                              className="p-1 hover:bg-white rounded text-slate-600 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeCartItem(item.variantId)}
                            className="text-slate-400 hover:text-red-650 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {cart.length === 0 && (
                    <div className="text-center py-20 space-y-3">
                      <ShoppingBag className="w-12 h-12 text-slate-350 mx-auto animate-pulse" />
                      <div>
                        <p className="font-bold text-slate-800">Operational Basket stands empty.</p>
                        <p className="text-slate-400">Discover circular smart objects back in the store to fill transactions.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Coupon & breakdown section */}
                {cart.length > 0 && (
                  <div className="p-4 bg-white border-t border-slate-200 space-y-4 text-xs">
                    
                    {/* Apply promo code input form */}
                    <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-1">
                      <input 
                        type="text" 
                        placeholder="ENTER COUPON CODE: ENTERPRISE30" 
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-grow bg-slate-50 border border-slate-200 tracking-wider rounded-lg px-2.5 py-1.5 text-[10px] font-mono placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button 
                        type="submit" 
                        className="bg-slate-900 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-slate-800 shrink-0 uppercase tracking-widest font-mono"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Breakdown prices details */}
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Line Subtotal:</span>
                        <span className="font-mono">{formatPrice(cartTotals.rawSubtotal)}</span>
                      </div>
                      
                      {cartTotals.discountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-600 font-bold">
                          <span>Applied Key discount ({cartTotals.appliedCode}):</span>
                          <span className="font-mono">-{formatPrice(cartTotals.discountAmount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-slate-500">
                        <span>VAT & State Taxes (18%):</span>
                        <span className="font-mono">{formatPrice(cartTotals.tax)}</span>
                      </div>

                      <div className="flex justify-between items-center text-slate-500 font-sans">
                        <span>Fulfillment (Standard courier):</span>
                        {cartTotals.shippingCharge === 0 ? (
                          <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest font-mono">FREE SHIPPED</span>
                        ) : (
                          <span className="font-mono">{formatPrice(cartTotals.shippingCharge)}</span>
                        )}
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-250 pt-2 text-sm text-slate-900 font-bold">
                        <span className="font-bold">Estimated Total Settle:</span>
                        <span className="font-mono text-indigo-700 font-extrabold text-base">{formatPrice(cartTotals.total)}</span>
                      </div>
                    </div>

                    {/* Select global active payment processor gateways */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-100 select-none">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Fiduciary Settlement Channel</span>
                      
                      <div className="grid grid-cols-3 gap-1.5 text-[10.5px]">
                        <button 
                          onClick={() => setSelectedPaymentMethod('stripe')}
                          className={`p-2 rounded-lg border text-center transition ${selectedPaymentMethod === 'stripe' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          Stripe (Sec)
                        </button>
                        <button 
                          onClick={() => setSelectedPaymentMethod('razorpay')}
                          className={`p-2 rounded-lg border text-center transition ${selectedPaymentMethod === 'razorpay' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          Razorpay UPI
                        </button>
                        <button 
                          onClick={() => setSelectedPaymentMethod('cod')}
                          className={`p-2 rounded-lg border text-center transition ${selectedPaymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          Cash on Deliv
                        </button>
                      </div>
                    </div>

                    {/* Proceed checkout trigger */}
                    <button 
                      onClick={handleProceedCheckout}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-center text-xs tracking-wider uppercase font-mono cursor-pointer shadow-sm flex items-center justify-center gap-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" /> Settle Transaction via OTP Guard
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}

      {/* CORE INTEGRATION & HEALTH METRICS STATUS BAR (Clean Minimalism Footer) */}
      <footer id="nexus_system_footer" className="mt-16 bg-slate-950 text-slate-400 px-6 sm:px-12 py-6 border-t border-slate-900 text-[10px] uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-sm">●</span>
              <span>API CLUSTER: OPERATIONAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 text-sm">●</span>
              <span>WORKER NODES: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-sm">●</span>
              <span>DB LATENCY: 14ms (SSL_PG)</span>
            </div>
          </div>
          
          <div className="flex gap-6 flex-wrap justify-center font-mono opacity-80">
            <span>Sess: JWT Secured</span>
            <span>Secure Build: {orders.length} ACTIVE_TXN</span>
            <span className="text-white">Design Style: Clean Minimalism</span>
          </div>
        </div>
        
        {/* Anti-branding credit disclaimer */}
        <div className="max-w-7xl mx-auto text-center mt-6 pt-4 border-t border-slate-900 text-slate-600 tracking-normal capitalize font-sans">
          &copy; 2026 Nexus Multi-Vendor E-Commerce Platform. Designed utilizing pristine layouts, lightweight state models, and scalable security.
        </div>
      </footer>

    </div>
  );
}
