import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Handshake, Truck, Search, ArrowRight } from 'lucide-react';
import Founder from "../../../public/images/Founder.jpeg";

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 font-serif overflow-hidden">

            <section className="relative h-[50vh] flex items-center justify-center bg-gray-900 text-white">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1449156006071-700994f79624?q=80&w=2000')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-gray-900"></div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center px-6"
                >
                    <h2 className="text-blue-400 uppercase tracking-[0.3em] font-sans font-bold mb-3 text-sm drop-shadow-md">
                        Presidential Vision
                    </h2>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                        Building Bridges of <span className="text-blue-500">Commerce</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light italic">
                        "Connecting Buyers & Sellers, Powering Dreams, One Doorstep at a Time."
                    </p>
                </motion.div>
            </section>


            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-400 translate-x-2 translate-y-2 z-0 opacity-50"></div>
                        <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-amber-600 -translate-x-2 -translate-y-2 z-0 opacity-50"></div>

                        <div className="relative z-10 bg-gray-900 p-3 shadow-2xl overflow-hidden rounded-sm">
                            <img
                                src={Founder}
                                alt="Akinpelu Oluwatayo"

                                className="w-full h-[650px] object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-gray-950 via-gray-900/90 to-transparent">
                                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">Akinpelu Oluwatayo</h3>
                                <p className="text-blue-400 font-sans tracking-[0.2em] uppercase text-xs font-bold">Founder & CEO</p>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold tracking-tighter uppercase font-sans">
                            Our Legacy
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                            Driven by a <br />
                            <span className="text-blue-600 italic">Singular Mission</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                            <p>
                                <span className="font-bold text-blue-600 text-2xl font-serif">DealBridgeConnect</span> was founded on a revolutionary principle: to create a secure, efficient, and dynamic marketplace where anyone can advertise and sell with unparalleled ease.
                            </p>
                            <p className="italic">
                                Our platform bridges the gap between trusted sellers and discerning buyers. We envision a future where every click leads to a successful exchange, powered by our commitment to forge seamless delivery systems that reach every doorstep.
                            </p>
                            <p>
                                Under the leadership of <span className="text-gray-900 dark:text-white font-bold border-b-2 border-amber-400">Akinpelu Oluwatayo</span>, we are not just building an app; we are cultivating a community that empowers growth, ensuring every success leaves a lasting connection.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>


            <section className="bg-gray-900 py-24 text-white relative">
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 tracking-tight">Our <span className="text-blue-400 italic">Core Pillars</span></h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <Handshake size={42} />, title: "Seamless Exchange", desc: "Effortless interaction between buyers and sellers globally." },
                            { icon: <ShieldCheck size={42} />, title: "Trusted Community", desc: "A secure ecosystem where integrity is our currency." },
                            { icon: <Truck size={42} />, title: "Reliable Delivery", desc: "From the marketplace straight to your doorstep with care." }
                        ].map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                            >
                                <div className="text-blue-500 mb-6 flex justify-center">{pillar.icon}</div>
                                <h3 className="text-xl font-bold mb-4 tracking-wide">{pillar.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
            </section>


            <footer className="py-12 border-t dark:border-gray-800 bg-white dark:bg-gray-950 text-center">
                <p className="text-gray-500 text-[10px] uppercase font-sans tracking-[0.4em]">
                    © 2026 DealBridgeConnect · All Rights Reserved · Built for Excellence
                </p>
            </footer>

        </div>
    );
};

export default AboutUs;