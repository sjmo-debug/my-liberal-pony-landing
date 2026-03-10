import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Store from "./pages/Store";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";
import PortfolioHome from "./pages/portfolio/PortfolioHome";
import PortfolioProjects from "./pages/portfolio/PortfolioProjects";
import PortfolioAbout from "./pages/portfolio/PortfolioAbout";
import PortfolioContact from "./pages/portfolio/PortfolioContact";
import PortfolioProjectDetail from "./pages/portfolio/PortfolioProjectDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/store" element={<Store />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* Portfolio sub-routes */}
          <Route path="/theSJMO" element={<Portfolio />}>
            <Route index element={<PortfolioHome />} />
            <Route path="projects" element={<PortfolioProjects />} />
            <Route path="about" element={<PortfolioAbout />} />
            <Route path="contact" element={<PortfolioContact />} />
            <Route path="project/:slug" element={<PortfolioProjectDetail />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
