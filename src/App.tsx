import { lazy, Suspense, useEffect } from "react";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Nav } from "./components/navigation/Nav";
import { Footer } from "./components/navigation/Footer";
import { MobileBar } from "./components/navigation/MobileBar";
import { OverlayProvider } from "./components/ui/Overlays";
import { LenisProvider, useLenis } from "./hooks/useLenis";
import { ScrollTrigger } from "./lib/gsap";
import Home from "./pages/Home";

const Experience = lazy(() => import("./pages/Experience"));
const Privacy = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Legal").then((m) => ({ default: m.Terms })));

function ScrollReset() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash, lenis]);
  return null;
}

function SiteLayout() {
  return (
    <>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}

function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center bg-ivory px-6 pt-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-5xl text-navy">This page isn't here.</h1>
      <Link to="/" className="btn btn-gold mt-10">
        Back to RADIANCE
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
    <LenisProvider>
      <OverlayProvider>
        <ScrollReset />
        <Suspense fallback={<div className="min-h-screen bg-navy" />}>
          <Routes>
            <Route path="/experience" element={<Experience />} />
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </OverlayProvider>
    </LenisProvider>
    </LazyMotion>
  );
}
