import { ConfigProvider, theme } from 'antd';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import CustomerPortal from "./pages/CustomerPortal";
import Promotions from "./pages/Promotions";
import BulkUpload from "./pages/BulkUpload";
import ApiDocs from "./pages/ApiDocs";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/calculator"} component={Calculator} />
      <Route path={"/products"} component={Products} />
      <Route path={"/customers"} component={Customers} />
      <Route path={"/promotions"} component={Promotions} />
      <Route path={"/bulk-upload"} component={BulkUpload} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/api-docs"} component={ApiDocs} />
      <Route path={"/portal/:customerId"} component={CustomerPortal} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#f5222d',
            colorInfo: '#1890ff',
            borderRadius: 6,
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          components: {
            Layout: {
              headerBg: '#001529',
              siderBg: '#001529',
            },
            Menu: {
              darkItemBg: '#001529',
              darkItemSelectedBg: '#1890ff',
            },
            Button: {
              primaryShadow: '0 2px 0 rgba(24, 144, 255, 0.1)',
            },
            Table: {
              headerBg: '#fafafa',
              headerColor: '#000000d9',
            },
          },
        }}
      >
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
