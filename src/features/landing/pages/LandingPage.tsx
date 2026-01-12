import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export const LandingPage: FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md dark:border-slate-800">
                <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
                    <Link to="/" className="flex items-center min-h-[52px] flex-shrink-0">
                        <img 
                            src="/logo.png" 
                            alt="FluxPay Logo" 
                            className="h-10 sm:h-12 w-auto object-contain object-center"
                            style={{ imageRendering: 'crisp-edges' }}
                        />
                    </Link>
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        <a 
                            className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer" 
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('solutions');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Solutions
                        </a>
                        <a 
                            className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer" 
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('pricing');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Pricing
                        </a>
                        <a 
                            className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer" 
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('developers');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            API
                        </a>
                        <a 
                            className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer" 
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('company');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Company
                        </a>
                    </nav>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <Link to={ROUTES.LOGIN} className="hidden sm:flex px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors touch-manipulation min-h-[44px] items-center">
                            Sign In
                        </Link>
                        <Link to={ROUTES.REGISTER} className="px-3 sm:px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 touch-manipulation min-h-[44px] flex items-center justify-center">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-8 items-center">
                        <div className="flex flex-col gap-4 sm:gap-6 max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                                Orchestrate your <span className="text-primary">revenue stack</span>.
                            </h1>
                            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                                FluxPay is the financial infrastructure platform for ambitious SaaS companies. Manage subscriptions, automate billing, and scale globally with a single integration.
                            </p>
                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                                <Link to={ROUTES.REGISTER} className="px-5 sm:px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 touch-manipulation min-h-[44px]">
                                    <span>Start Building</span>
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </Link>
                                <button 
                                    onClick={() => window.location.href = 'mailto:sales@fluxpay.com?subject=Sales Inquiry'}
                                    className="px-5 sm:px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors touch-manipulation min-h-[44px]"
                                >
                                    Contact Sales
                                </button>
                            </div>
                            <div className="pt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-green-500 text-[16px] sm:text-[18px]">check_circle</span>
                                    <span>Free sandbox account</span>
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>No credit card required</span>
                            </div>
                        </div>
                        <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-full blur-3xl -z-10"></div>
                            <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500 mx-4 sm:mx-0">
                                <div className="h-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-3 gap-1.5">
                                    <div className="size-2.5 rounded-full bg-red-400"></div>
                                    <div className="size-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="size-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Revenue</div>
                                            <div className="text-3xl font-bold text-slate-900 dark:text-white">$2,405,102.00</div>
                                        </div>
                                        <div className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">+12.5%</div>
                                    </div>
                                    <div className="w-full h-32 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700 flex items-end justify-between px-2 pb-2 gap-1">
                                        <div className="w-full bg-primary/20 h-[40%] rounded-sm"></div>
                                        <div className="w-full bg-primary/30 h-[60%] rounded-sm"></div>
                                        <div className="w-full bg-primary/40 h-[45%] rounded-sm"></div>
                                        <div className="w-full bg-primary/50 h-[70%] rounded-sm"></div>
                                        <div className="w-full bg-primary/60 h-[55%] rounded-sm"></div>
                                        <div className="w-full bg-primary/80 h-[85%] rounded-sm"></div>
                                        <div className="w-full bg-primary h-[65%] rounded-sm"></div>
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 bg-white dark:bg-slate-800 rounded shadow-sm flex items-center justify-center text-primary font-bold">S</div>
                                                <div className="text-sm font-medium">Stark Industries</div>
                                            </div>
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">$14,200.00</div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 bg-white dark:bg-slate-800 rounded shadow-sm flex items-center justify-center text-orange-500 font-bold">W</div>
                                                <div className="text-sm font-medium">Wayne Ent.</div>
                                            </div>
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">$9,450.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 sm:py-10 border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6 sm:mb-8">Trusted by forward-thinking enterprises</p>
                    <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-12 gap-y-6 sm:gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined">hexagon</span> ACME Corp
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined">change_history</span> Vertex
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined">all_inclusive</span> Infinite
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined">cloud</span> Nimbus
                        </div>
                        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-white">
                            <span className="material-symbols-outlined">bolt</span> Flash
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 lg:py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 sm:mb-16 md:text-center max-w-3xl mx-auto">
                        <h2 className="text-primary font-bold tracking-wide uppercase text-xs sm:text-sm mb-3">Features</h2>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            Everything you need to <span className="whitespace-nowrap">scale revenue</span>
                        </h3>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                            Designed to help you reach more customers and recover more revenue without lifting a finger. Our suite of tools handles the complexity.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="group p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="size-10 sm:size-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px] sm:text-[28px]">public</span>
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">Global Payments</h4>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                Accept payments in 135+ currencies and dozens of payment methods locally. We handle the FX conversion automatically.
                            </p>
                        </div>
                        <div className="group p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="size-10 sm:size-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px] sm:text-[28px]">autorenew</span>
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Retries</h4>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                Our machine learning models recover 5% more revenue by retrying failed charges at the optimal times for each bank.
                            </p>
                        </div>
                        <div className="group p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                            <div className="size-10 sm:size-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[24px] sm:text-[28px]">payments</span>
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Payouts</h4>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                Access your funds immediately with real-time payouts to your bank account. No more waiting 3-5 business days.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                Developer First
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-6">
                                Integrate in minutes, <br className="hidden sm:block"/>not months.
                            </h3>
                            <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed">
                                We obsess over our API design so you don't have to. With typed SDKs for every major language, detailed documentation, and a CLI tool, your team will be up and running before lunch.
                            </p>
                            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-400">terminal</span>
                                    <span className="text-slate-200 font-medium">Robust CLI for testing webhooks locally</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-400">library_books</span>
                                    <span className="text-slate-200 font-medium">Comprehensive API Reference</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-400">security</span>
                                    <span className="text-slate-200 font-medium">SOC2 Compliant & PCI DSS Level 1</span>
                                </li>
                            </ul>
                            <a className="inline-flex items-center gap-2 text-white font-bold hover:text-blue-400 transition-colors touch-manipulation min-h-[44px]" href="#">
                                Read the documentation
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </a>
                        </div>
                        <div className="order-1 lg:order-2 w-full">
                            <div className="rounded-xl overflow-hidden bg-[#0f172a] shadow-2xl border border-slate-700/50 mx-4 sm:mx-0">
                                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-[#1e293b] border-b border-slate-700">
                                    <span className="text-xs text-slate-400 font-mono truncate">create-subscription.js</span>
                                    <div className="flex gap-1.5">
                                        <div className="size-2.5 rounded-full bg-slate-600"></div>
                                        <div className="size-2.5 rounded-full bg-slate-600"></div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 overflow-x-auto">
                                    <pre className="font-mono text-xs sm:text-sm leading-relaxed">
                                        <code>
                                            <span className="text-purple-400">const</span> <span className="text-blue-400">stripe</span> <span className="text-slate-300">=</span> <span className="text-purple-400">require</span>(<span className="text-green-400">'fluxpay'</span>)(<span className="text-green-400">'sk_test_...'</span>);{'\n'}
                                            {'\n'}
                                            <span className="text-slate-500">// Create a new customer and subscription</span>{'\n'}
                                            <span className="text-purple-400">const</span> <span className="text-blue-400">subscription</span> <span className="text-slate-300">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">fluxpay</span>.<span className="text-blue-400">subscriptions</span>.<span className="text-yellow-400">create</span>({'{'}{'\n'}
                                            {'  '}<span className="text-blue-300">customer</span>: <span className="text-green-400">'cus_N4z3q...'</span>,{'\n'}
                                            {'  '}<span className="text-blue-300">items</span>: [{'\n'}
                                            {'    {'} <span className="text-blue-300">price</span>: <span className="text-green-400">'price_1Mow...'</span> {'}'},{'\n'}
                                            {'  '}],{'\n'}
                                            {'  '}<span className="text-blue-300">payment_behavior</span>: <span className="text-green-400">'default_incomplete'</span>,{'\n'}
                                            {'  '}<span className="text-blue-300">expand</span>: [<span className="text-green-400">'latest_invoice.payment_intent'</span>],{'\n'}
                                            {'}'});{'\n'}
                                            {'\n'}
                                            <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-blue-400">subscription</span>.<span className="text-blue-300">status</span>); <span className="text-slate-500">// 'active'</span>
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            Insights at your <br className="hidden sm:block"/>fingertips
                        </h2>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
                            Powerful reporting tools that help you understand your business health in real-time. Segment by region, plan, or cohort.
                        </p>
                    </div>
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-2 sm:p-3 md:p-4">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-4 z-10">
                            <div className="flex gap-1.5">
                                <div className="size-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                                <div className="size-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                                <div className="size-3 rounded-full bg-slate-200 dark:bg-slate-600"></div>
                            </div>
                            <div className="flex-1 max-w-xl bg-slate-100 dark:bg-slate-900 h-6 rounded flex items-center px-3 text-xs text-slate-400">
                                fluxpay.com/dashboard/analytics
                            </div>
                        </div>
                        <div className="pt-8 sm:pt-10 w-full overflow-hidden aspect-[16/9] md:aspect-[21/9]">
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                <div className="text-slate-400 dark:text-slate-500 text-sm">Dashboard Preview</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 sm:py-16 lg:py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#3c83f6 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="material-symbols-outlined text-4xl sm:text-5xl lg:text-6xl text-primary/40 mb-6 sm:mb-8">format_quote</span>
                    <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed text-white px-2">
                        "FluxPay replaced three different tools in our stack. The integration took one sprint, and we've seen a <span className="text-primary font-bold">15% reduction in involuntary churn</span> since switching. It's the most robust billing engine we've used."
                    </blockquote>
                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <div className="h-14 w-14 rounded-full border-2 border-primary bg-slate-700 flex items-center justify-center text-white font-bold">SJ</div>
                        <div className="text-left">
                            <div className="text-lg font-bold text-white">Sarah Jenkins</div>
                            <div className="text-slate-400">CTO at TechFlow</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 sm:py-16 lg:py-20 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Ready to scale your revenue?</h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
                        Join thousands of businesses that trust FluxPay to handle their billing infrastructure. Get started for free today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link to={ROUTES.REGISTER} className="px-6 sm:px-8 py-3 sm:py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm sm:text-base touch-manipulation min-h-[44px] flex items-center justify-center">
                            Create free account
                        </Link>
                        <button 
                            onClick={() => window.location.href = 'mailto:sales@fluxpay.com?subject=Sales Inquiry'}
                            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm sm:text-base touch-manipulation min-h-[44px]"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-50 dark:bg-slate-900 pt-12 sm:pt-16 pb-6 sm:pb-8 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center min-h-[52px] mb-4">
                                <img 
                                    src="/logo.png" 
                                    alt="FluxPay Logo" 
                                    className="h-10 sm:h-12 w-auto object-contain object-center"
                                    style={{ imageRendering: 'crisp-edges' }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4 sm:mb-6 leading-relaxed">
                                The financial infrastructure platform for the internet. Orchestrate revenue, manage subscriptions, and handle global tax.
                            </p>
                            <div className="flex gap-3 sm:gap-4">
                                <a className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" href="#" aria-label="Twitter">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                                    </svg>
                                </a>
                                <a className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" href="#" aria-label="GitHub">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" href="#" aria-label="LinkedIn">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Product</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Payments</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Billing</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Invoicing</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Terminal</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Identity</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Documentation</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">API Reference</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Blog</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Community</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wider">Company</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">About Us</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Customers</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Careers</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Blog</a></li>
                                <li><a className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                        <p className="text-xs text-slate-400 text-center sm:text-left">© 2024 FluxPay Inc. All rights reserved.</p>
                        <div className="flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-400 justify-center sm:justify-end">
                            <Link to={ROUTES.PRIVACY_POLICY} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors touch-manipulation">
                                Privacy Policy
                            </Link>
                            <Link to={ROUTES.TERMS_OF_SERVICE} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors touch-manipulation">
                                Terms of Service
                            </Link>
                            <Link to={ROUTES.COOKIE_POLICY} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors touch-manipulation">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
