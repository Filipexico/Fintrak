/**
 * Lista completa de países do mundo com códigos ISO 3166-1 alpha-2
 * e taxas fiscais aproximadas (percentuais de imposto sobre renda para trabalhadores autônomos)
 */

export interface CountryTaxRule {
  country: string // ISO 3166-1 alpha-2
  displayName: string
  percentage: number // Taxa de imposto aproximada (0.15 = 15%)
}

export const ALL_COUNTRIES_TAX_RULES: CountryTaxRule[] = [
  // América do Norte
  { country: "US", displayName: "United States", percentage: 0.22 },
  { country: "CA", displayName: "Canada", percentage: 0.20 },
  { country: "MX", displayName: "Mexico", percentage: 0.16 },

  // América Central e Caribe
  { country: "GT", displayName: "Guatemala", percentage: 0.15 },
  { country: "BZ", displayName: "Belize", percentage: 0.15 },
  { country: "SV", displayName: "El Salvador", percentage: 0.15 },
  { country: "HN", displayName: "Honduras", percentage: 0.15 },
  { country: "NI", displayName: "Nicaragua", percentage: 0.15 },
  { country: "CR", displayName: "Costa Rica", percentage: 0.15 },
  { country: "PA", displayName: "Panama", percentage: 0.15 },
  { country: "CU", displayName: "Cuba", percentage: 0.20 },
  { country: "JM", displayName: "Jamaica", percentage: 0.20 },
  { country: "HT", displayName: "Haiti", percentage: 0.15 },
  { country: "DO", displayName: "Dominican Republic", percentage: 0.15 },
  { country: "PR", displayName: "Puerto Rico", percentage: 0.20 },
  { country: "TT", displayName: "Trinidad and Tobago", percentage: 0.20 },
  { country: "BB", displayName: "Barbados", percentage: 0.20 },
  { country: "BS", displayName: "Bahamas", percentage: 0.15 },
  { country: "AG", displayName: "Antigua and Barbuda", percentage: 0.15 },
  { country: "DM", displayName: "Dominica", percentage: 0.15 },
  { country: "GD", displayName: "Grenada", percentage: 0.15 },
  { country: "KN", displayName: "Saint Kitts and Nevis", percentage: 0.15 },
  { country: "LC", displayName: "Saint Lucia", percentage: 0.15 },
  { country: "VC", displayName: "Saint Vincent and the Grenadines", percentage: 0.15 },

  // América do Sul
  { country: "BR", displayName: "Brazil", percentage: 0.15 },
  { country: "AR", displayName: "Argentina", percentage: 0.21 },
  { country: "CL", displayName: "Chile", percentage: 0.20 },
  { country: "CO", displayName: "Colombia", percentage: 0.19 },
  { country: "PE", displayName: "Peru", percentage: 0.15 },
  { country: "VE", displayName: "Venezuela", percentage: 0.15 },
  { country: "EC", displayName: "Ecuador", percentage: 0.15 },
  { country: "BO", displayName: "Bolivia", percentage: 0.13 },
  { country: "PY", displayName: "Paraguay", percentage: 0.10 },
  { country: "UY", displayName: "Uruguay", percentage: 0.20 },
  { country: "GY", displayName: "Guyana", percentage: 0.20 },
  { country: "SR", displayName: "Suriname", percentage: 0.20 },
  { country: "GF", displayName: "French Guiana", percentage: 0.20 },
  { country: "FK", displayName: "Falkland Islands", percentage: 0.20 },

  // Europa Ocidental
  { country: "GB", displayName: "United Kingdom", percentage: 0.20 },
  { country: "IE", displayName: "Ireland", percentage: 0.20 },
  { country: "FR", displayName: "France", percentage: 0.20 },
  { country: "DE", displayName: "Germany", percentage: 0.19 },
  { country: "IT", displayName: "Italy", percentage: 0.23 },
  { country: "ES", displayName: "Spain", percentage: 0.19 },
  { country: "PT", displayName: "Portugal", percentage: 0.23 },
  { country: "NL", displayName: "Netherlands", percentage: 0.20 },
  { country: "BE", displayName: "Belgium", percentage: 0.25 },
  { country: "LU", displayName: "Luxembourg", percentage: 0.20 },
  { country: "CH", displayName: "Switzerland", percentage: 0.15 },
  { country: "AT", displayName: "Austria", percentage: 0.20 },
  { country: "LI", displayName: "Liechtenstein", percentage: 0.15 },
  { country: "MC", displayName: "Monaco", percentage: 0.15 },
  { country: "AD", displayName: "Andorra", percentage: 0.10 },
  { country: "SM", displayName: "San Marino", percentage: 0.15 },
  { country: "VA", displayName: "Vatican City", percentage: 0.00 },

  // Europa do Norte
  { country: "DK", displayName: "Denmark", percentage: 0.25 },
  { country: "SE", displayName: "Sweden", percentage: 0.25 },
  { country: "NO", displayName: "Norway", percentage: 0.22 },
  { country: "FI", displayName: "Finland", percentage: 0.20 },
  { country: "IS", displayName: "Iceland", percentage: 0.20 },
  { country: "EE", displayName: "Estonia", percentage: 0.20 },
  { country: "LV", displayName: "Latvia", percentage: 0.20 },
  { country: "LT", displayName: "Lithuania", percentage: 0.20 },

  // Europa Central e Oriental
  { country: "PL", displayName: "Poland", percentage: 0.18 },
  { country: "CZ", displayName: "Czech Republic", percentage: 0.15 },
  { country: "SK", displayName: "Slovakia", percentage: 0.19 },
  { country: "HU", displayName: "Hungary", percentage: 0.15 },
  { country: "RO", displayName: "Romania", percentage: 0.10 },
  { country: "BG", displayName: "Bulgaria", percentage: 0.10 },
  { country: "HR", displayName: "Croatia", percentage: 0.20 },
  { country: "SI", displayName: "Slovenia", percentage: 0.20 },
  { country: "RS", displayName: "Serbia", percentage: 0.10 },
  { country: "BA", displayName: "Bosnia and Herzegovina", percentage: 0.10 },
  { country: "ME", displayName: "Montenegro", percentage: 0.09 },
  { country: "MK", displayName: "North Macedonia", percentage: 0.10 },
  { country: "AL", displayName: "Albania", percentage: 0.10 },
  { country: "GR", displayName: "Greece", percentage: 0.22 },
  { country: "CY", displayName: "Cyprus", percentage: 0.20 },
  { country: "MT", displayName: "Malta", percentage: 0.20 },

  // Europa Oriental
  { country: "RU", displayName: "Russia", percentage: 0.13 },
  { country: "UA", displayName: "Ukraine", percentage: 0.18 },
  { country: "BY", displayName: "Belarus", percentage: 0.13 },
  { country: "MD", displayName: "Moldova", percentage: 0.12 },
  { country: "GE", displayName: "Georgia", percentage: 0.20 },
  { country: "AM", displayName: "Armenia", percentage: 0.20 },
  { country: "AZ", displayName: "Azerbaijan", percentage: 0.14 },

  // Ásia Ocidental / Oriente Médio
  { country: "TR", displayName: "Turkey", percentage: 0.20 },
  { country: "IL", displayName: "Israel", percentage: 0.20 },
  { country: "SA", displayName: "Saudi Arabia", percentage: 0.20 },
  { country: "AE", displayName: "United Arab Emirates", percentage: 0.00 },
  { country: "KW", displayName: "Kuwait", percentage: 0.00 },
  { country: "QA", displayName: "Qatar", percentage: 0.00 },
  { country: "BH", displayName: "Bahrain", percentage: 0.00 },
  { country: "OM", displayName: "Oman", percentage: 0.00 },
  { country: "YE", displayName: "Yemen", percentage: 0.15 },
  { country: "IQ", displayName: "Iraq", percentage: 0.15 },
  { country: "IR", displayName: "Iran", percentage: 0.20 },
  { country: "JO", displayName: "Jordan", percentage: 0.14 },
  { country: "LB", displayName: "Lebanon", percentage: 0.20 },
  { country: "SY", displayName: "Syria", percentage: 0.20 },
  { country: "PS", displayName: "Palestine", percentage: 0.15 },
  { country: "CY", displayName: "Cyprus", percentage: 0.20 },

  // Ásia Central
  { country: "KZ", displayName: "Kazakhstan", percentage: 0.10 },
  { country: "UZ", displayName: "Uzbekistan", percentage: 0.12 },
  { country: "TM", displayName: "Turkmenistan", percentage: 0.10 },
  { country: "TJ", displayName: "Tajikistan", percentage: 0.13 },
  { country: "KG", displayName: "Kyrgyzstan", percentage: 0.10 },
  { country: "AF", displayName: "Afghanistan", percentage: 0.20 },
  { country: "MN", displayName: "Mongolia", percentage: 0.10 },

  // Ásia do Sul
  { country: "IN", displayName: "India", percentage: 0.20 },
  { country: "PK", displayName: "Pakistan", percentage: 0.20 },
  { country: "BD", displayName: "Bangladesh", percentage: 0.20 },
  { country: "LK", displayName: "Sri Lanka", percentage: 0.18 },
  { country: "NP", displayName: "Nepal", percentage: 0.20 },
  { country: "BT", displayName: "Bhutan", percentage: 0.20 },
  { country: "MV", displayName: "Maldives", percentage: 0.15 },

  // Ásia Oriental
  { country: "CN", displayName: "China", percentage: 0.20 },
  { country: "JP", displayName: "Japan", percentage: 0.20 },
  { country: "KR", displayName: "South Korea", percentage: 0.20 },
  { country: "KP", displayName: "North Korea", percentage: 0.20 },
  { country: "TW", displayName: "Taiwan", percentage: 0.20 },
  { country: "HK", displayName: "Hong Kong", percentage: 0.15 },
  { country: "MO", displayName: "Macau", percentage: 0.12 },

  // Sudeste Asiático
  { country: "ID", displayName: "Indonesia", percentage: 0.20 },
  { country: "MY", displayName: "Malaysia", percentage: 0.20 },
  { country: "SG", displayName: "Singapore", percentage: 0.20 },
  { country: "TH", displayName: "Thailand", percentage: 0.20 },
  { country: "VN", displayName: "Vietnam", percentage: 0.20 },
  { country: "PH", displayName: "Philippines", percentage: 0.20 },
  { country: "MM", displayName: "Myanmar", percentage: 0.20 },
  { country: "KH", displayName: "Cambodia", percentage: 0.20 },
  { country: "LA", displayName: "Laos", percentage: 0.20 },
  { country: "BN", displayName: "Brunei", percentage: 0.20 },
  { country: "TL", displayName: "Timor-Leste", percentage: 0.20 },

  // África do Norte
  { country: "EG", displayName: "Egypt", percentage: 0.20 },
  { country: "LY", displayName: "Libya", percentage: 0.15 },
  { country: "TN", displayName: "Tunisia", percentage: 0.20 },
  { country: "DZ", displayName: "Algeria", percentage: 0.20 },
  { country: "MA", displayName: "Morocco", percentage: 0.20 },
  { country: "SD", displayName: "Sudan", percentage: 0.20 },
  { country: "SS", displayName: "South Sudan", percentage: 0.20 },

  // África Ocidental
  { country: "NG", displayName: "Nigeria", percentage: 0.20 },
  { country: "GH", displayName: "Ghana", percentage: 0.20 },
  { country: "SN", displayName: "Senegal", percentage: 0.20 },
  { country: "CI", displayName: "Ivory Coast", percentage: 0.20 },
  { country: "ML", displayName: "Mali", percentage: 0.20 },
  { country: "BF", displayName: "Burkina Faso", percentage: 0.20 },
  { country: "NE", displayName: "Niger", percentage: 0.20 },
  { country: "TD", displayName: "Chad", percentage: 0.20 },
  { country: "MR", displayName: "Mauritania", percentage: 0.20 },
  { country: "GN", displayName: "Guinea", percentage: 0.20 },
  { country: "GW", displayName: "Guinea-Bissau", percentage: 0.20 },
  { country: "SL", displayName: "Sierra Leone", percentage: 0.20 },
  { country: "LR", displayName: "Liberia", percentage: 0.20 },
  { country: "TG", displayName: "Togo", percentage: 0.20 },
  { country: "BJ", displayName: "Benin", percentage: 0.20 },
  { country: "CM", displayName: "Cameroon", percentage: 0.20 },
  { country: "CF", displayName: "Central African Republic", percentage: 0.20 },
  { country: "GA", displayName: "Gabon", percentage: 0.20 },
  { country: "CG", displayName: "Republic of the Congo", percentage: 0.20 },
  { country: "CD", displayName: "Democratic Republic of the Congo", percentage: 0.20 },
  { country: "AO", displayName: "Angola", percentage: 0.20 },
  { country: "GQ", displayName: "Equatorial Guinea", percentage: 0.20 },
  { country: "ST", displayName: "São Tomé and Príncipe", percentage: 0.20 },

  // África Oriental
  { country: "ET", displayName: "Ethiopia", percentage: 0.20 },
  { country: "ER", displayName: "Eritrea", percentage: 0.20 },
  { country: "DJ", displayName: "Djibouti", percentage: 0.20 },
  { country: "SO", displayName: "Somalia", percentage: 0.20 },
  { country: "KE", displayName: "Kenya", percentage: 0.20 },
  { country: "UG", displayName: "Uganda", percentage: 0.20 },
  { country: "RW", displayName: "Rwanda", percentage: 0.20 },
  { country: "BI", displayName: "Burundi", percentage: 0.20 },
  { country: "TZ", displayName: "Tanzania", percentage: 0.20 },
  { country: "MW", displayName: "Malawi", percentage: 0.20 },
  { country: "ZM", displayName: "Zambia", percentage: 0.20 },
  { country: "ZW", displayName: "Zimbabwe", percentage: 0.20 },
  { country: "MZ", displayName: "Mozambique", percentage: 0.20 },
  { country: "MG", displayName: "Madagascar", percentage: 0.20 },
  { country: "MU", displayName: "Mauritius", percentage: 0.15 },
  { country: "SC", displayName: "Seychelles", percentage: 0.15 },
  { country: "KM", displayName: "Comoros", percentage: 0.20 },

  // África do Sul
  { country: "ZA", displayName: "South Africa", percentage: 0.18 },
  { country: "BW", displayName: "Botswana", percentage: 0.20 },
  { country: "NA", displayName: "Namibia", percentage: 0.20 },
  { country: "SZ", displayName: "Eswatini", percentage: 0.20 },
  { country: "LS", displayName: "Lesotho", percentage: 0.20 },

  // Oceania
  { country: "AU", displayName: "Australia", percentage: 0.20 },
  { country: "NZ", displayName: "New Zealand", percentage: 0.20 },
  { country: "PG", displayName: "Papua New Guinea", percentage: 0.20 },
  { country: "FJ", displayName: "Fiji", percentage: 0.20 },
  { country: "NC", displayName: "New Caledonia", percentage: 0.20 },
  { country: "PF", displayName: "French Polynesia", percentage: 0.20 },
  { country: "WS", displayName: "Samoa", percentage: 0.20 },
  { country: "TO", displayName: "Tonga", percentage: 0.20 },
  { country: "VU", displayName: "Vanuatu", percentage: 0.20 },
  { country: "SB", displayName: "Solomon Islands", percentage: 0.20 },
  { country: "KI", displayName: "Kiribati", percentage: 0.20 },
  { country: "TV", displayName: "Tuvalu", percentage: 0.20 },
  { country: "NR", displayName: "Nauru", percentage: 0.20 },
  { country: "PW", displayName: "Palau", percentage: 0.20 },
  { country: "FM", displayName: "Micronesia", percentage: 0.20 },
  { country: "MH", displayName: "Marshall Islands", percentage: 0.20 },
]




