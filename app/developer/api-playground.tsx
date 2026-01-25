import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, useWindowDimensions, TouchableOpacity, TextInput, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { DeveloperPageHeader } from '@/components/developer/DeveloperPageHeader';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';

// Clipboard helper
const copyToClipboard = async (text: string): Promise<boolean> => {
  if (Platform.OS === "web") {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  return false;
};

// API Endpoints with schemas
const apiEndpoints = [
  {
    id: "list-businesses",
    method: "GET",
    path: "/businesses",
    name: "List Businesses",
    description: "Retrieve a paginated list of all businesses",
    category: "Businesses",
    params: [
      { name: "page", type: "number", description: "Page number", default: "1" },
      { name: "limit", type: "number", description: "Items per page", default: "20" },
      { name: "category", type: "string", description: "Filter by category" },
    ],
    exampleResponse: {
      data: [
        { id: "biz_123456", name: "Example Business", category: "Retail", verified: true },
        { id: "biz_789012", name: "Another Business", category: "Food", verified: false },
      ],
      pagination: { page: 1, limit: 20, total: 42 },
    },
  },
  {
    id: "get-business",
    method: "GET",
    path: "/businesses/{id}",
    name: "Get Business",
    description: "Retrieve details for a specific business",
    category: "Businesses",
    params: [
      { name: "id", type: "string", description: "Business ID", required: true, inPath: true },
    ],
    exampleResponse: {
      data: {
        id: "biz_123456",
        name: "Example Business",
        description: "A sample business",
        category: "Retail",
        verified: true,
        createdAt: "2024-01-15T10:30:00Z",
      },
    },
  },
  {
    id: "create-payment",
    method: "POST",
    path: "/payments/c2b",
    name: "Create Payment",
    description: "Process a consumer-to-business payment",
    category: "Payments",
    body: {
      businessId: { type: "string", required: true, description: "Business receiving payment" },
      amount: { type: "number", required: true, description: "Payment amount" },
      currency: { type: "string", default: "USD", description: "Currency code" },
      description: { type: "string", description: "Payment description" },
    },
    exampleBody: {
      businessId: "biz_123456",
      amount: 100.00,
      currency: "USD",
      description: "Payment for services",
    },
    exampleResponse: {
      data: {
        id: "pay_abc123",
        businessId: "biz_123456",
        amount: 100.00,
        currency: "USD",
        status: "completed",
        createdAt: "2024-01-15T10:30:00Z",
      },
    },
  },
  {
    id: "list-transactions",
    method: "GET",
    path: "/transactions",
    name: "List Transactions",
    description: "Retrieve transaction history",
    category: "Transactions",
    params: [
      { name: "page", type: "number", description: "Page number", default: "1" },
      { name: "limit", type: "number", description: "Items per page", default: "20" },
      { name: "status", type: "string", description: "Filter by status (pending, completed, failed)" },
    ],
    exampleResponse: {
      data: [
        { id: "txn_123", type: "payment", amount: 50.00, status: "completed" },
        { id: "txn_456", type: "refund", amount: 25.00, status: "pending" },
      ],
      pagination: { page: 1, limit: 20, total: 156 },
    },
  },
  {
    id: "get-current-user",
    method: "GET",
    path: "/users/me",
    name: "Get Current User",
    description: "Retrieve information about the authenticated user",
    category: "Users",
    params: [],
    exampleResponse: {
      data: {
        id: "usr_abc123",
        email: "user@example.com",
        name: "John Doe",
        createdAt: "2024-01-01T00:00:00Z",
      },
    },
  },
  {
    id: "create-webhook",
    method: "POST",
    path: "/webhooks",
    name: "Create Webhook",
    description: "Register a new webhook endpoint",
    category: "Webhooks",
    body: {
      url: { type: "string", required: true, description: "Webhook URL (must be HTTPS)" },
      events: { type: "array", required: true, description: "Events to subscribe to" },
    },
    exampleBody: {
      url: "https://your-server.com/webhook",
      events: ["payment.completed", "payment.failed"],
    },
    exampleResponse: {
      data: {
        id: "wh_abc123",
        url: "https://your-server.com/webhook",
        events: ["payment.completed", "payment.failed"],
        secret: "whsec_...",
        active: true,
      },
    },
  },
];

const methodColors: Record<string, string> = {
  GET: "#2196f3",
  POST: "#4caf50",
  PUT: "#ff9800",
  DELETE: "#f44336",
  PATCH: "#9c27b0",
};

interface EndpointType {
  id: string;
  method: string;
  path: string;
  name: string;
  description: string;
  category: string;
  params?: Array<{
    name: string;
    type: string;
    description: string;
    default?: string;
    required?: boolean;
    inPath?: boolean;
  }>;
  body?: Record<string, { type: string; required?: boolean; default?: string; description: string } | undefined>;
  exampleBody?: Record<string, any>;
  exampleResponse: Record<string, any>;
}

export default function ApiPlayground() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  
  // Responsive spacing
  const horizontalPadding = isMobile ? 20 : isTablet ? 32 : 48;
  const sectionGap = isMobile ? 20 : 28;
  const cardPadding = isMobile ? 16 : 24;
  
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointType | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api-sandbox.bdn.com/api/v1");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState("");
  const [response, setResponse] = useState<string>("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"request" | "response" | "code">("request");
  const [showEndpoints, setShowEndpoints] = useState(!isMobile);

  // Group endpoints by category
  const categories = apiEndpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.category]) {
      acc[endpoint.category] = [];
    }
    acc[endpoint.category].push(endpoint);
    return acc;
  }, {} as Record<string, EndpointType[]>);

  const handleSelectEndpoint = useCallback((endpoint: EndpointType) => {
    setSelectedEndpoint(endpoint);
    setParamValues({});
    setBodyValue(endpoint.exampleBody ? JSON.stringify(endpoint.exampleBody, null, 2) : "");
    setResponse("");
    setResponseStatus(null);
    setActiveTab("request");
    // Auto-collapse endpoints on mobile after selection
    if (isMobile) {
      setShowEndpoints(false);
    }
  }, [isMobile]);

  const buildUrl = useCallback(() => {
    if (!selectedEndpoint) return "";
    
    let url = selectedEndpoint.path;
    
    // Replace path parameters
    selectedEndpoint.params?.forEach(param => {
      if (param.inPath && paramValues[param.name]) {
        url = url.replace(`{${param.name}}`, paramValues[param.name]);
      }
    });
    
    // Add query parameters
    const queryParams = selectedEndpoint.params
      ?.filter(p => !p.inPath && paramValues[p.name])
      .map(p => `${p.name}=${encodeURIComponent(paramValues[p.name])}`)
      .join("&");
    
    if (queryParams) {
      url += `?${queryParams}`;
    }
    
    return `${baseUrl}${url}`;
  }, [selectedEndpoint, paramValues, baseUrl]);

  const generateCurl = useCallback(() => {
    if (!selectedEndpoint) return "";
    
    const url = buildUrl();
    let curl = `curl -X ${selectedEndpoint.method} "${url}"`;
    curl += `\n  -H "Authorization: Bearer ${apiKey || "YOUR_API_KEY"}"`;
    curl += `\n  -H "Content-Type: application/json"`;
    
    if (selectedEndpoint.method !== "GET" && bodyValue) {
      curl += `\n  -d '${bodyValue.replace(/\n/g, "")}'`;
    }
    
    return curl;
  }, [selectedEndpoint, buildUrl, apiKey, bodyValue]);

  const generateJavaScript = useCallback(() => {
    if (!selectedEndpoint) return "";
    
    const url = buildUrl();
    let code = `const response = await fetch("${url}", {\n`;
    code += `  method: "${selectedEndpoint.method}",\n`;
    code += `  headers: {\n`;
    code += `    "Authorization": "Bearer ${apiKey || "YOUR_API_KEY"}",\n`;
    code += `    "Content-Type": "application/json"\n`;
    code += `  }`;
    
    if (selectedEndpoint.method !== "GET" && bodyValue) {
      code += `,\n  body: JSON.stringify(${bodyValue})`;
    }
    
    code += `\n});\n\nconst data = await response.json();`;
    return code;
  }, [selectedEndpoint, buildUrl, apiKey, bodyValue]);

  const generatePython = useCallback(() => {
    if (!selectedEndpoint) return "";
    
    const url = buildUrl();
    let code = `import requests\n\n`;
    code += `headers = {\n`;
    code += `    "Authorization": "Bearer ${apiKey || "YOUR_API_KEY"}",\n`;
    code += `    "Content-Type": "application/json"\n`;
    code += `}\n\n`;
    
    if (selectedEndpoint.method === "GET") {
      code += `response = requests.get("${url}", headers=headers)\n`;
    } else if (selectedEndpoint.method === "POST") {
      code += `data = ${bodyValue || "{}"}\n\n`;
      code += `response = requests.post("${url}", headers=headers, json=data)\n`;
    } else {
      code += `data = ${bodyValue || "{}"}\n\n`;
      code += `response = requests.${selectedEndpoint.method.toLowerCase()}("${url}", headers=headers, json=data)\n`;
    }
    
    code += `print(response.json())`;
    return code;
  }, [selectedEndpoint, buildUrl, apiKey, bodyValue]);

  const handleSendRequest = useCallback(async () => {
    if (!selectedEndpoint) return;
    
    setIsLoading(true);
    setResponse("");
    setResponseStatus(null);
    
    // Simulate API response after a delay
    setTimeout(() => {
      // Use example response for demo
      setResponse(JSON.stringify(selectedEndpoint.exampleResponse, null, 2));
      setResponseStatus(selectedEndpoint.method === "POST" ? 201 : 200);
      setIsLoading(false);
      setActiveTab("response");
    }, 800);
  }, [selectedEndpoint]);

  const handleCopy = useCallback(async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingTop: Platform.OS === "web" ? 24 : 40,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <DeveloperPageHeader
          title="API Playground"
          description="Interactive API explorer. Select an endpoint, configure parameters, and test requests."
        />

        {/* Server & Auth Config */}
        <View
          style={{
            backgroundColor: "#474747",
            borderRadius: 16,
            padding: cardPadding,
            marginBottom: sectionGap,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 20 }}>
            Configuration
          </Text>
          <View style={{ flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 24 }}>
            <View style={{ flex: isMobile ? undefined : 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
                Server Environment
              </Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setBaseUrl("https://api-sandbox.bdn.com/api/v1")}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: baseUrl.includes("sandbox") ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: baseUrl.includes("sandbox") ? "#ba9988" : "rgba(186,153,136,0.2)",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>Sandbox</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBaseUrl("https://api.bdn.com/api/v1")}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 10,
                    backgroundColor: !baseUrl.includes("sandbox") ? "#ba9988" : "#232323",
                    borderWidth: 1,
                    borderColor: !baseUrl.includes("sandbox") ? "#ba9988" : "rgba(186,153,136,0.2)",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}>Production</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: isMobile ? undefined : 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
                API Key
              </Text>
              <TextInput
                placeholder="Enter your API key"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                style={{
                  backgroundColor: "#232323",
                  borderRadius: 10,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  color: "#ffffff",
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: "rgba(186,153,136,0.2)",
                }}
              />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: sectionGap }}>
          {/* Endpoint List */}
          <View style={{ width: isDesktop ? 320 : "100%" }}>
            {/* Endpoint Header - Collapsible on mobile */}
            <TouchableOpacity
              onPress={() => isMobile && setShowEndpoints(!showEndpoints)}
              activeOpacity={isMobile ? 0.7 : 1}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#ffffff" }}>
                Endpoints
              </Text>
              {isMobile && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {selectedEndpoint && (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 6,
                        backgroundColor: `${methodColors[selectedEndpoint.method]}20`,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "600", color: methodColors[selectedEndpoint.method] }}>
                        {selectedEndpoint.name}
                      </Text>
                    </View>
                  )}
                  <MaterialIcons
                    name={showEndpoints ? "expand-less" : "expand-more"}
                    size={24}
                    color="rgba(255,255,255,0.6)"
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* Endpoint List - Collapsible on mobile */}
            {(showEndpoints || !isMobile) && (
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  marginBottom: isMobile ? sectionGap : 0,
                }}
              >
                {Object.entries(categories).map(([category, endpoints], catIndex) => (
                  <View key={category}>
                    <View
                      style={{
                        backgroundColor: "#3a3a3a",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderTopWidth: catIndex > 0 ? 1 : 0,
                        borderTopColor: "rgba(186,153,136,0.2)",
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.2 }}>
                        {category}
                      </Text>
                    </View>
                    {endpoints.map((endpoint) => (
                      <TouchableOpacity
                        key={endpoint.id}
                        onPress={() => handleSelectEndpoint(endpoint)}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 14,
                          paddingHorizontal: 16,
                          backgroundColor: selectedEndpoint?.id === endpoint.id ? "rgba(186,153,136,0.15)" : "transparent",
                          borderLeftWidth: selectedEndpoint?.id === endpoint.id ? 3 : 0,
                          borderLeftColor: "#ba9988",
                        }}
                      >
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 6,
                            backgroundColor: `${methodColors[endpoint.method]}20`,
                            marginRight: 12,
                            minWidth: 48,
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ fontSize: 11, fontWeight: "700", color: methodColors[endpoint.method] }}>
                            {endpoint.method}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: "#ffffff", flex: 1 }} numberOfLines={1}>
                          {endpoint.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Request/Response Panel */}
          <View style={{ flex: 1 }}>
            {selectedEndpoint ? (
              <>
                {/* Endpoint Header */}
                <View
                  style={{
                    backgroundColor: "#3a3a3a",
                    borderRadius: 12,
                    padding: isMobile ? 16 : 20,
                    marginBottom: 20,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                        backgroundColor: `${methodColors[selectedEndpoint.method]}20`,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "700", color: methodColors[selectedEndpoint.method] }}>
                        {selectedEndpoint.method}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: isMobile ? 13 : 14,
                        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                        color: "rgba(255,255,255,0.85)",
                        flex: 1,
                      }}
                      numberOfLines={isMobile ? 2 : 1}
                    >
                      {selectedEndpoint.path}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 20 }}>
                    {selectedEndpoint.description}
                  </Text>
                </View>

                {/* Tabs */}
                <View style={{ flexDirection: "row", marginBottom: 20, gap: 10 }}>
                  {(["request", "response", "code"] as const).map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      activeOpacity={0.7}
                      style={{
                        flex: isMobile ? 1 : undefined,
                        paddingHorizontal: isMobile ? 12 : 20,
                        paddingVertical: 12,
                        borderRadius: 10,
                        backgroundColor: activeTab === tab ? "#ba9988" : "#474747",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#ffffff", textTransform: "capitalize" }}>
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tab Content */}
                <View
                  style={{
                    backgroundColor: "#474747",
                    borderRadius: 16,
                    padding: cardPadding,
                    borderWidth: 1,
                    borderColor: "rgba(186, 153, 136, 0.2)",
                  }}
                >
                  {activeTab === "request" && (
                    <>
                      {/* Parameters */}
                      {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                        <View style={{ marginBottom: 24 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff", marginBottom: 16 }}>
                            Parameters
                          </Text>
                          <View style={{ gap: 16 }}>
                            {selectedEndpoint.params.map((param) => (
                              <View key={param.name}>
                                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#ba9988" }}>
                                    {param.name}
                                  </Text>
                                  {param.required && (
                                    <Text style={{ fontSize: 12, color: "#f44336", marginLeft: 4 }}>*</Text>
                                  )}
                                  <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginLeft: 10 }}>
                                    {param.type}
                                  </Text>
                                </View>
                                <TextInput
                                  placeholder={param.description}
                                  placeholderTextColor="rgba(255,255,255,0.4)"
                                  value={paramValues[param.name] || ""}
                                  onChangeText={(text) => setParamValues({ ...paramValues, [param.name]: text })}
                                  style={{
                                    backgroundColor: "#232323",
                                    borderRadius: 10,
                                    paddingVertical: 14,
                                    paddingHorizontal: 16,
                                    color: "#ffffff",
                                    fontSize: 14,
                                    borderWidth: 1,
                                    borderColor: "rgba(186,153,136,0.2)",
                                  }}
                                />
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Request Body */}
                      {selectedEndpoint.body && (
                        <View style={{ marginBottom: 24 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff", marginBottom: 16 }}>
                            Request Body
                          </Text>
                          <TextInput
                            placeholder='{"key": "value"}'
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={bodyValue}
                            onChangeText={setBodyValue}
                            multiline
                            numberOfLines={8}
                            style={{
                              backgroundColor: "#232323",
                              borderRadius: 10,
                              paddingVertical: 16,
                              paddingHorizontal: 16,
                              color: "#ffffff",
                              fontSize: 13,
                              fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                              borderWidth: 1,
                              borderColor: "rgba(186,153,136,0.2)",
                              minHeight: 160,
                              textAlignVertical: "top",
                              lineHeight: 20,
                            }}
                          />
                        </View>
                      )}

                      {/* Send Button */}
                      <TouchableOpacity
                        onPress={handleSendRequest}
                        disabled={isLoading}
                        activeOpacity={0.8}
                        style={{
                          backgroundColor: "#2196f3",
                          borderRadius: 12,
                          paddingVertical: 16,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 10,
                          opacity: isLoading ? 0.7 : 1,
                        }}
                      >
                        <MaterialIcons name={isLoading ? "hourglass-empty" : "send"} size={20} color="#ffffff" />
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#ffffff" }}>
                          {isLoading ? "Sending..." : "Send Request"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {activeTab === "response" && (
                    <>
                      {responseStatus && (
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginRight: 10 }}>
                            Status:
                          </Text>
                          <View
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              borderRadius: 8,
                              backgroundColor: responseStatus < 300 ? "#4caf5020" : "#f4433620",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: responseStatus < 300 ? "#4caf50" : "#f44336",
                              }}
                            >
                              {responseStatus} {responseStatus < 300 ? "OK" : "Error"}
                            </Text>
                          </View>
                        </View>
                      )}
                      {response ? (
                        <View>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <Text style={{ fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.6)" }}>Response Body</Text>
                            <TouchableOpacity
                              onPress={() => handleCopy(response, "response")}
                              activeOpacity={0.7}
                              style={{ padding: 8 }}
                            >
                              <MaterialIcons
                                name={copiedField === "response" ? "check" : "content-copy"}
                                size={18}
                                color="#ba9988"
                              />
                            </TouchableOpacity>
                          </View>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{
                              backgroundColor: "#232323",
                              borderRadius: 10,
                              borderWidth: 1,
                              borderColor: "rgba(186,153,136,0.2)",
                            }}
                          >
                            <View style={{ padding: 16, minWidth: "100%" }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                                  color: "#ffffff",
                                  lineHeight: 22,
                                }}
                              >
                                {response}
                              </Text>
                            </View>
                          </ScrollView>
                        </View>
                      ) : (
                        <View style={{ paddingVertical: 48, alignItems: "center" }}>
                          <MaterialIcons name="send" size={40} color="rgba(255,255,255,0.2)" />
                          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 16 }}>
                            Send a request to see the response
                          </Text>
                        </View>
                      )}
                    </>
                  )}

                  {activeTab === "code" && (
                    <View style={{ gap: 24 }}>
                      {/* cURL */}
                      <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>cURL</Text>
                          <TouchableOpacity
                            onPress={() => handleCopy(generateCurl(), "curl")}
                            activeOpacity={0.7}
                            style={{ padding: 8 }}
                          >
                            <MaterialIcons
                              name={copiedField === "curl" ? "check" : "content-copy"}
                              size={18}
                              color="#ba9988"
                            />
                          </TouchableOpacity>
                        </View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "rgba(186,153,136,0.2)",
                          }}
                        >
                          <View style={{ padding: 16 }}>
                            <Text style={{ fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", color: "#ffffff", lineHeight: 20 }}>
                              {generateCurl()}
                            </Text>
                          </View>
                        </ScrollView>
                      </View>

                      {/* JavaScript */}
                      <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>JavaScript</Text>
                          <TouchableOpacity
                            onPress={() => handleCopy(generateJavaScript(), "js")}
                            activeOpacity={0.7}
                            style={{ padding: 8 }}
                          >
                            <MaterialIcons
                              name={copiedField === "js" ? "check" : "content-copy"}
                              size={18}
                              color="#ba9988"
                            />
                          </TouchableOpacity>
                        </View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "rgba(186,153,136,0.2)",
                          }}
                        >
                          <View style={{ padding: 16 }}>
                            <Text style={{ fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", color: "#ffffff", lineHeight: 20 }}>
                              {generateJavaScript()}
                            </Text>
                          </View>
                        </ScrollView>
                      </View>

                      {/* Python */}
                      <View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>Python</Text>
                          <TouchableOpacity
                            onPress={() => handleCopy(generatePython(), "python")}
                            activeOpacity={0.7}
                            style={{ padding: 8 }}
                          >
                            <MaterialIcons
                              name={copiedField === "python" ? "check" : "content-copy"}
                              size={18}
                              color="#ba9988"
                            />
                          </TouchableOpacity>
                        </View>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          style={{
                            backgroundColor: "#232323",
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "rgba(186,153,136,0.2)",
                          }}
                        >
                          <View style={{ padding: 16 }}>
                            <Text style={{ fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", color: "#ffffff", lineHeight: 20 }}>
                              {generatePython()}
                            </Text>
                          </View>
                        </ScrollView>
                      </View>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <View
                style={{
                  backgroundColor: "#474747",
                  borderRadius: 16,
                  paddingVertical: 60,
                  paddingHorizontal: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(186, 153, 136, 0.2)",
                  minHeight: isMobile ? 250 : 350,
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: "rgba(186, 153, 136, 0.1)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <MaterialIcons name="touch-app" size={40} color="rgba(255,255,255,0.3)" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: 8, textAlign: "center" }}>
                  Select an Endpoint
                </Text>
                <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 20 }}>
                  Choose an endpoint from the list to configure parameters and test requests
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
