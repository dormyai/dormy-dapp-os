export const propertyAddress = '0x069C3198bBd9a7F71cbf7e80A9c1C9d5f2Dd4052'
export const propertyAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_accessControlAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "PropertyId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            }
        ],
        "name": "PropertyCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "PropertyCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "accessControl",
        "outputs": [
            {
                "internalType": "contract AccessControl",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "propertyNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint64",
                        "name": "creation",
                        "type": "uint64"
                    },
                    {
                        "internalType": "enum IProperty.PropertyStatus",
                        "name": "propertyStatus",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct IProperty.PropertyInfo",
                "name": "info",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "country",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "county",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "city",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "state",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "postalCode",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "address1",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "address2",
                        "type": "string"
                    }
                ],
                "internalType": "struct IProperty.PropertyLocationData",
                "name": "location",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "propertyPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "soldQuantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectedAnnualReturn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectedRentalYield",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rentStartDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint64",
                        "name": "saleStartTime",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "saleEndTime",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minPurchase",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPurchase",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minIncrement",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IProperty.InvestmentValue",
                "name": "investmentValue",
                "type": "tuple"
            }
        ],
        "name": "createProperty",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            }
        ],
        "name": "getPropertyAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            }
        ],
        "name": "getPropertyInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "propertyNumber",
                        "type": "string"
                    },
                    {
                        "internalType": "uint64",
                        "name": "creation",
                        "type": "uint64"
                    },
                    {
                        "internalType": "enum IProperty.PropertyStatus",
                        "name": "propertyStatus",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct IProperty.PropertyInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "soltId",
                "type": "uint256"
            }
        ],
        "name": "getPropertyInfoBySolt",
        "outputs": [
            {
                "internalType": "contract Property",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            }
        ],
        "name": "getPropertyInvestmentValue",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "propertyPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "soldQuantity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectedAnnualReturn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "projectedRentalYield",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rentStartDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint64",
                        "name": "saleStartTime",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint64",
                        "name": "saleEndTime",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minPurchase",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPurchase",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minIncrement",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct IProperty.InvestmentValue",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "propertys",
        "outputs": [
            {
                "internalType": "contract Property",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "soltOfPropertys",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "soltId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "soldQuantity",
                "type": "uint256"
            }
        ],
        "name": "updatePropertySoldQuantity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            },
            {
                "internalType": "enum IProperty.PropertyStatus",
                "name": "newStatus",
                "type": "uint8"
            }
        ],
        "name": "updatePropertyStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "propertyNumber",
                "type": "string"
            },
            {
                "internalType": "enum IProperty.TenancyStatus",
                "name": "newStatus",
                "type": "uint8"
            }
        ],
        "name": "updatePropertyTenancyStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]