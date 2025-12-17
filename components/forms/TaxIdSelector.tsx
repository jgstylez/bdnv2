/**
 * Tax ID Selector Component
 * 
 * A reusable component for selecting tax ID types based on country
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TaxIdType, CountryCode, TaxIdentification } from '../../types/international';
import { getDefaultTaxIdType, validateTaxId } from '../../lib/international';

interface TaxIdSelectorProps {
  value?: TaxIdentification;
  onChange: (taxId: TaxIdentification) => void;
  country: CountryCode;
  required?: boolean;
  style?: any;
}

const TAX_ID_TYPES: Record<TaxIdType, { label: string; description: string; countries: CountryCode[] }> = {
  EIN: {
    label: "EIN (Employer Identification Number)",
    description: "United States",
    countries: ["US"],
  },
  SSN: {
    label: "SSN (Social Security Number)",
    description: "United States - Individual",
    countries: ["US"],
  },
  VAT: {
    label: "VAT (Value Added Tax)",
    description: "General VAT number",
    countries: [],
  },
  GST: {
    label: "GST (Goods and Services Tax)",
    description: "Canada, Australia, India",
    countries: ["CA", "AU", "IN"],
  },
  HST: {
    label: "HST (Harmonized Sales Tax)",
    description: "Canada",
    countries: ["CA"],
  },
  PST: {
    label: "PST (Provincial Sales Tax)",
    description: "Canada",
    countries: ["CA"],
  },
  ABN: {
    label: "ABN (Australian Business Number)",
    description: "Australia",
    countries: ["AU"],
  },
  ACN: {
    label: "ACN (Australian Company Number)",
    description: "Australia",
    countries: ["AU"],
  },
  CNPJ: {
    label: "CNPJ (Brazil Company Registration)",
    description: "Brazil",
    countries: ["BR"],
  },
  RFC: {
    label: "RFC (Mexico Tax ID)",
    description: "Mexico",
    countries: ["MX"],
  },
  CUIT: {
    label: "CUIT (Argentina Tax ID)",
    description: "Argentina",
    countries: ["AR"],
  },
  RUT: {
    label: "RUT (Chile Tax ID)",
    description: "Chile",
    countries: ["CL"],
  },
  NIT: {
    label: "NIT (Colombia Tax ID)",
    description: "Colombia",
    countries: ["CO"],
  },
  RUC: {
    label: "RUC (Peru Tax ID)",
    description: "Peru",
    countries: ["PE"],
  },
  CIF: {
    label: "CIF (Spain Tax ID)",
    description: "Spain",
    countries: ["ES"],
  },
  SIRET: {
    label: "SIRET (France Company Registration)",
    description: "France",
    countries: ["FR"],
  },
  "VAT-GB": {
    label: "VAT Number (UK)",
    description: "United Kingdom",
    countries: ["GB"],
  },
  "VAT-EU": {
    label: "VAT Number (EU)",
    description: "European Union",
    countries: [],
  },
  PAN: {
    label: "PAN (India Permanent Account Number)",
    description: "India",
    countries: ["IN"],
  },
  UEN: {
    label: "UEN (Singapore Unique Entity Number)",
    description: "Singapore",
    countries: ["SG"],
  },
  TRN: {
    label: "TRN (UAE Tax Registration Number)",
    description: "United Arab Emirates",
    countries: ["AE"],
  },
  CR: {
    label: "CR (Saudi Arabia Commercial Registration)",
    description: "Saudi Arabia",
    countries: ["SA"],
  },
  OTHER: {
    label: "Other Tax ID",
    description: "Other country-specific tax ID",
    countries: [],
  },
};

export function TaxIdSelector({
  value,
  onChange,
  country,
  required = false,
  style,
}: TaxIdSelectorProps) {
  const [showTypeList, setShowTypeList] = useState(false);
  const [taxId, setTaxId] = useState<TaxIdentification>(
    value || {
      type: getDefaultTaxIdType(country),
      number: "",
      country,
    }
  );

  useEffect(() => {
    // Update tax ID when country changes
    if (taxId.country !== country) {
      const newType = getDefaultTaxIdType(country);
      setTaxId({
        type: newType,
        number: taxId.number,
        country,
      });
    }
  }, [country]);

  useEffect(() => {
    onChange(taxId);
  }, [taxId]);

  // Filter tax ID types relevant to the country
  const getAvailableTypes = (): TaxIdType[] => {
    const countrySpecific = Object.entries(TAX_ID_TYPES)
      .filter(([_, info]) => info.countries.includes(country))
      .map(([type]) => type as TaxIdType);

    // Also include general types (VAT, OTHER)
    const generalTypes: TaxIdType[] = ["VAT", "OTHER"];

    return [...countrySpecific, ...generalTypes];
  };

  const availableTypes = getAvailableTypes();
  const selectedTypeInfo = TAX_ID_TYPES[taxId.type];
  const isValid = taxId.number ? validateTaxId(taxId) : !required;

  return (
    <View style={[{ gap: 16 }, style]}>
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Tax ID Type {required && <Text style={{ color: "#ba9988" }}>*</Text>}
        </Text>
        <TouchableOpacity
          onPress={() => setShowTypeList(!showTypeList)}
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(186, 153, 136, 0.2)",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
              {selectedTypeInfo?.label || taxId.type}
            </Text>
            {selectedTypeInfo?.description && (
              <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 }}>
                {selectedTypeInfo.description}
              </Text>
            )}
          </View>
          <MaterialIcons
            name={showTypeList ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={20}
            color="#ba9988"
          />
        </TouchableOpacity>

        {showTypeList && (
          <View
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 4,
              backgroundColor: "#474747",
              borderRadius: 12,
              maxHeight: 300,
              zIndex: 1000,
              borderWidth: 1,
              borderColor: "rgba(186, 153, 136, 0.2)",
            }}
          >
            <ScrollView style={{ maxHeight: 300 }}>
              {availableTypes.map((type) => {
                const typeInfo = TAX_ID_TYPES[type];
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setTaxId((prev) => ({ ...prev, type, number: "" }));
                      setShowTypeList(false);
                    }}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(186, 153, 136, 0.1)",
                      backgroundColor: taxId.type === type ? "rgba(186, 153, 136, 0.1)" : "transparent",
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                      {typeInfo.label}
                    </Text>
                    <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 12, marginTop: 4 }}>
                      {typeInfo.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          Tax ID Number {required && <Text style={{ color: "#ba9988" }}>*</Text>}
        </Text>
        <TextInput
          value={taxId.number}
          onChangeText={(text) => setTaxId((prev) => ({ ...prev, number: text }))}
          placeholder={`Enter ${selectedTypeInfo?.label || "tax ID"} number`}
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          style={{
            backgroundColor: "#232323",
            borderRadius: 12,
            padding: 16,
            color: "#ffffff",
            fontSize: 14,
            borderWidth: 1,
            borderColor: isValid
              ? "rgba(186, 153, 136, 0.2)"
              : taxId.number
              ? "rgba(255, 0, 0, 0.5)"
              : "rgba(186, 153, 136, 0.2)",
          }}
        />
        {taxId.number && !isValid && (
          <Text style={{ color: "rgba(255, 0, 0, 0.7)", fontSize: 12, marginTop: 4 }}>
            Invalid {selectedTypeInfo?.label || "tax ID"} format
          </Text>
        )}
      </View>
    </View>
  );
}

