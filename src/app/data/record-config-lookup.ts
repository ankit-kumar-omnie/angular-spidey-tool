export interface ConfigElement {
  elementId: string;
  elementLabel: string;
}

export interface ConfigSection {
  section: { sectionId: string; sectionLabel: string };
  elements: ConfigElement[];
}

export interface ConfigEntry {
  config: { configId: string; configLabel: string };
  sections: ConfigSection[];
}

export const RECORD_CONFIG_LOOKUP: ConfigEntry[]=  [
  {
    "config": {
      "configId": "5538d8a5-8835-459d-823a-f05485625f6c",
      "configLabel": "Status History Record"
    },
    "sections": [
      {
        "section": {
          "sectionId": "6d1b92f9-ebb7-414a-b579-ebec36073216",
          "sectionLabel": "Referred"
        },
        "elements": [
          {
            "elementId": "447e7c6d-494e-40d7-856e-4e92f2442424",
            "elementLabel": "Referred"
          }
        ]
      },
      {
        "section": {
          "sectionId": "1507b5b4-bc04-4040-bf8c-3f0e1c098131",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "5bca0398-24c8-4330-9ffe-e4d793420231",
            "elementLabel": "ReferredClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d798ad98-7ea7-4c4c-aff7-efedcd80f230",
          "sectionLabel": "DIF Applicant"
        },
        "elements": [
          {
            "elementId": "8f70f58c-53b5-43fd-be60-cfc1cba80263",
            "elementLabel": "DIF Applicant"
          }
        ]
      },
      {
        "section": {
          "sectionId": "9e923877-d3c2-488c-bf9f-42576e20473a",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "5aaa784a-05f6-4243-9446-024120f05743",
            "elementLabel": "DifApplicantClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "85bc9e12-4dc4-4418-9fd8-13723d1d2c88",
          "sectionLabel": "Potentially Eligible"
        },
        "elements": [
          {
            "elementId": "14ebd8a9-a6f7-4432-a60f-a67f2ddc286f",
            "elementLabel": "Potentially Eligible"
          }
        ]
      },
      {
        "section": {
          "sectionId": "512b355b-5e42-4c6e-93aa-fec33038548b",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "e0fe6933-1fc5-4e54-aff6-e91f4f287dcd",
            "elementLabel": "PotentiallyEligibleClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d19148e3-53bc-44fb-84b5-202c6135f9e0",
          "sectionLabel": "Applicant"
        },
        "elements": [
          {
            "elementId": "a5747512-9ef8-438e-9207-e394041b24c3",
            "elementLabel": "Applicant"
          }
        ]
      },
      {
        "section": {
          "sectionId": "0b6a9d07-54de-427b-8961-50fd6472ed8e",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "72ef3de4-d58b-46a2-8aaa-318c5278c5b8",
            "elementLabel": "ApplicantClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7a787bfb-e2c3-42f9-897b-179ff4dd674a",
          "sectionLabel": "Eligible"
        },
        "elements": [
          {
            "elementId": "8cf352a3-de30-47a9-b81b-f6a0a8f02699",
            "elementLabel": "Eligible"
          }
        ]
      },
      {
        "section": {
          "sectionId": "22db5f52-0ec7-47de-bf12-714f50f01863",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "36684d9e-8ef7-46d1-bcd1-5fa3d7bd3b17",
            "elementLabel": "EligibleClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "cf6f9f05-6c70-484a-8c38-351db226b358",
          "sectionLabel": "Plan"
        },
        "elements": [
          {
            "elementId": "eb81de99-972e-4428-a2c0-903fa9e77920",
            "elementLabel": "Plan"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d58472b7-d75a-437a-b0a8-a50b7966aae4",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "a8cf6414-9f80-4281-ba14-ec91c7758f8d",
            "elementLabel": "PlanClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "a6571f84-22d2-4689-a061-9047c3bd8d27",
          "sectionLabel": "Employed"
        },
        "elements": [
          {
            "elementId": "439cec3a-6955-4271-a894-ed10cba10e47",
            "elementLabel": "Employed"
          }
        ]
      },
      {
        "section": {
          "sectionId": "3125c76a-39f2-4d61-a820-903d7bd61659",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "bb187b2b-9e00-4ae8-971b-f5513435761f",
            "elementLabel": "EmployedClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "950b01c0-af3e-451e-b431-97e76716aab7",
          "sectionLabel": "Stable Employment"
        },
        "elements": [
          {
            "elementId": "70889110-7104-4c34-a7de-a3d4ffd8381f",
            "elementLabel": "Stable Employment"
          }
        ]
      },
      {
        "section": {
          "sectionId": "4f4017c7-234e-4f0a-ae1b-74ffe73d9baf",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "02419f49-46cb-437b-b087-7af690031637",
            "elementLabel": "StableEmploymentClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "eff17bf7-6289-41b4-a537-e7adf679d0b0",
          "sectionLabel": "Job Ready"
        },
        "elements": [
          {
            "elementId": "41431964-b998-4b4b-bdca-aa274cf0c720",
            "elementLabel": "Job Ready"
          }
        ]
      },
      {
        "section": {
          "sectionId": "257629ab-0d21-438b-9b21-8dddf4cbe196",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "6565da8f-0bd3-4880-944f-8d9554f9151a",
            "elementLabel": "JobReadyClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7f8ac27b-8f9f-4eb6-a923-00d3a7242532",
          "sectionLabel": "Waitlist"
        },
        "elements": [
          {
            "elementId": "1f73202f-8148-4d18-b1d1-02bb8d89586d",
            "elementLabel": "Waitlist"
          }
        ]
      },
      {
        "section": {
          "sectionId": "a48821a8-18a8-4ac3-8f69-529974be0fb4",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "059b0cc7-7f61-4114-ac6e-08cd3f8e1155",
            "elementLabel": "WaitlistClosure"
          }
        ]
      },
      {
        "section": {
          "sectionId": "e780d60b-1c5b-4f8b-9708-9cc5c8701a97",
          "sectionLabel": "Trial Work"
        },
        "elements": [
          {
            "elementId": "00a261e1-d7ff-490d-93aa-96021107c566",
            "elementLabel": "Trial Work"
          }
        ]
      },
      {
        "section": {
          "sectionId": "a74637d5-8028-4ed0-90db-373781679af5",
          "sectionLabel": "Closure"
        },
        "elements": [
          {
            "elementId": "1e641f5a-5750-4ccd-a99b-49428effede7",
            "elementLabel": "TrialWorkClosure"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "f1476f79-1062-412d-b728-7d02db758fe4",
      "configLabel": "Status Extension"
    },
    "sections": [
      {
        "section": {
          "sectionId": "ec4e53d5-6af1-4481-a224-76a33f9c974a",
          "sectionLabel": "Extension info"
        },
        "elements": [
          {
            "elementId": "069cb4b0-1ef6-43ca-9e9b-52698e871a5f",
            "elementLabel": "Status Due Date"
          },
          {
            "elementId": "1e73de85-c3bf-41cb-9fd7-c78149dc396c",
            "elementLabel": "New Status Due Date"
          },
          {
            "elementId": "9b07596e-eb18-48ea-be1e-125cfa9a16b4",
            "elementLabel": "Number of Days"
          },
          {
            "elementId": "151b3893-56bb-4ab2-9bef-1204d5826281",
            "elementLabel": "Reason for Request"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "6a0cb3a9-eb12-4ea9-ad59-1729549923cd",
      "configLabel": "Demographic"
    },
    "sections": [
      {
        "section": {
          "sectionId": "de67cdd1-dc27-46a2-ba8d-06edadbb92b8",
          "sectionLabel": "Personal Information"
        },
        "elements": [
          {
            "elementId": "9a466b21-8f28-4e35-91d2-746b6178afbe",
            "elementLabel": "Name"
          },
          {
            "elementId": "610e59a5-4946-4f38-83e9-c7cc7796e62d",
            "elementLabel": "Preferred Name"
          },
          {
            "elementId": "7e717752-1377-4f89-986b-43e38c0514d3",
            "elementLabel": "Preferred Pronouns"
          },
          {
            "elementId": "b3d2312e-8313-4614-90d0-d37cf675638e",
            "elementLabel": "Salutation"
          },
          {
            "elementId": "8d795e8c-988b-478d-aa2b-011c8dd447e3",
            "elementLabel": "Date of birth"
          },
          {
            "elementId": "64c74e38-6145-486c-8651-07b215535a50",
            "elementLabel": "Age"
          },
          {
            "elementId": "dacd724f-2939-4907-9eb5-e205eba5fe94",
            "elementLabel": "SSN"
          },
          {
            "elementId": "2b37ea8a-a732-4b6d-ba96-07d6b2c6877d",
            "elementLabel": "Participant ID"
          },
          {
            "elementId": "b64dff07-2a48-446b-ac2e-30a88fb0a541",
            "elementLabel": "Deceased information"
          },
          {
            "elementId": "8e70baae-3471-427e-915c-3c76c7bf3adc",
            "elementLabel": "Is this a confidential case?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d02b917f-74ee-4748-a5a3-f79d60ec1c7e",
          "sectionLabel": "Individual Characteristics"
        },
        "elements": [
          {
            "elementId": "26c22c04-ff96-47f4-9aee-f0f8d1f7800c",
            "elementLabel": "Ethnicity"
          },
          {
            "elementId": "036d7435-ce4b-4015-85f4-2e57707a48a4",
            "elementLabel": "Race"
          },
          {
            "elementId": "2dc82e70-8e86-48d0-b15c-04dfcb89a388",
            "elementLabel": "Reservation"
          },
          {
            "elementId": "8133116a-55eb-4dad-9835-bd4fd4268b41",
            "elementLabel": "Gender (2024 WIOA Category)"
          },
          {
            "elementId": "f96a85b9-fc68-453c-a27a-5711892459c8",
            "elementLabel": "Tribe"
          }
        ]
      },
      {
        "section": {
          "sectionId": "187ba2f6-76fb-4b44-affa-3cfb0aa2325e",
          "sectionLabel": "Contact Information"
        },
        "elements": [
          {
            "elementId": "bcef1700-99d3-4b53-bcc6-4fad092a0b41",
            "elementLabel": "Primary Phone"
          },
          {
            "elementId": "b8998ec8-c05d-4a75-b2f1-80cf10dbc7bc",
            "elementLabel": "Phone Type"
          },
          {
            "elementId": "a23e907b-757e-49a3-a397-9497ad492e4f",
            "elementLabel": "Secondary Phone"
          },
          {
            "elementId": "a6319c64-7d7f-477e-91b1-25e1b3dbebb6",
            "elementLabel": "Phone Type"
          },
          {
            "elementId": "00b0eb13-b252-4c2d-bc4e-68b736d68efc",
            "elementLabel": "Email Address"
          },
          {
            "elementId": "0e98c440-8275-4f1f-a568-33efe4f1a2bb",
            "elementLabel": "Notes"
          }
        ]
      },
      {
        "section": {
          "sectionId": "e841f5d5-e554-4b57-ac08-b44222ed0497",
          "sectionLabel": "Primary Residence"
        },
        "elements": [
          {
            "elementId": "2515a5e8-88fb-4a24-bf9a-ba2ff96897ce",
            "elementLabel": "Primary Residence"
          }
        ]
      },
      {
        "section": {
          "sectionId": "bc413a9e-1b09-4ccc-95eb-57839239fc8e",
          "sectionLabel": "Mailing Address"
        },
        "elements": [
          {
            "elementId": "c7b7764d-bcac-49fc-b8e1-d53b3cc42ee3",
            "elementLabel": "Mailing Address"
          }
        ]
      },
      {
        "section": {
          "sectionId": "4af33594-ce62-4e89-9901-62ca4caa1b8e",
          "sectionLabel": "International Address"
        },
        "elements": [
          {
            "elementId": "5fb9c48d-060c-43ee-874b-9a93458a739c",
            "elementLabel": "Street Address"
          },
          {
            "elementId": "c889f2aa-b73e-4ed4-90e7-1d91de20d54d",
            "elementLabel": "Address 2"
          },
          {
            "elementId": "3b141212-9fed-4a39-b3b0-3eef94376d3e",
            "elementLabel": "Country of Residence"
          },
          {
            "elementId": "2b1c203b-ed5d-44b7-929a-bbe8393531db",
            "elementLabel": "Is the mailing address the same as the above address?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "8a93f1aa-dff2-4724-aac9-3d2fd1f12b7f",
          "sectionLabel": "International Mailing Address"
        },
        "elements": [
          {
            "elementId": "8e2b7b3f-2a57-4a9f-8194-ffde784c1d05",
            "elementLabel": "Street Address"
          },
          {
            "elementId": "81089dbe-f0d0-4840-8273-0bae2835d849",
            "elementLabel": "Address 2"
          },
          {
            "elementId": "3643f19a-02ca-4ad6-9cea-a44c3b2c36ad",
            "elementLabel": "Country of Residence"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c85c0047-51f8-41bc-af86-625949e63c4f",
          "sectionLabel": "Guardian Information"
        },
        "elements": [
          {
            "elementId": "d945ccc2-f99b-4ca9-8109-3673928777f5",
            "elementLabel": "Guardian Name"
          },
          {
            "elementId": "e4163796-5e05-4f31-bb1f-3b33aca1ce13",
            "elementLabel": "Relationship to Participant"
          },
          {
            "elementId": "d945ccc2-f99b-4ca9-8109-3673928789f5",
            "elementLabel": "Phone"
          },
          {
            "elementId": "f0ac9e71-a066-431d-9a94-e1ed9ead3259",
            "elementLabel": "Phone Type"
          },
          {
            "elementId": "0e538c29-ad91-44b9-a6f8-3fa21dec074f",
            "elementLabel": "Email"
          },
          {
            "elementId": "6b83b9e0-9c09-4686-add7-234428888945",
            "elementLabel": "Notes"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c0f84566-9782-4d4e-b559-9a5953db4446",
          "sectionLabel": "Guardian Address"
        },
        "elements": [
          {
            "elementId": "665c6d41-b63d-44bb-bcc7-fa3eaee8b0dd",
            "elementLabel": "Street Address"
          },
          {
            "elementId": "14a6f1ed-862b-4bec-a708-97fc6bdd5cfe",
            "elementLabel": "Address 2"
          },
          {
            "elementId": "ad8f46f5-bc6a-4323-a6be-52a156d81a61",
            "elementLabel": "City"
          },
          {
            "elementId": "00d5a5e8-7ed6-4a60-8d88-819e987a3d9e",
            "elementLabel": "State"
          },
          {
            "elementId": "619c1145-578e-4f6f-b7c9-4170fbf97295",
            "elementLabel": "Zip Code"
          }
        ]
      },
      {
        "section": {
          "sectionId": "bab9b555-7585-4e7c-9417-0949f2f41eca",
          "sectionLabel": "Alternate Contact"
        },
        "elements": [
          {
            "elementId": "5be7e653-dc74-4714-9814-208f4c2781d7",
            "elementLabel": "Contact Name"
          },
          {
            "elementId": "56d6f261-32e2-4e85-9290-05721a1971a2",
            "elementLabel": "Contact Type"
          },
          {
            "elementId": "5be7e653-dc74-4714-9814-208f4c2781ea",
            "elementLabel": "Contact info"
          }
        ]
      },
      {
        "section": {
          "sectionId": "51f33b32-b373-47ac-8a9f-7b30f45cb43a",
          "sectionLabel": "Alternate Contact 2"
        },
        "elements": [
          {
            "elementId": "e280d7f4-7e6c-4095-9f7a-e07826c697ff",
            "elementLabel": "Contact Name"
          },
          {
            "elementId": "0d8e5324-7a8e-44cb-a571-67702d5b734b",
            "elementLabel": "Contact Type"
          },
          {
            "elementId": "e041d0f1-bfa1-42fb-bf75-7bbf5ba96f57",
            "elementLabel": "Contact info"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c69bc141-086e-4be1-ad61-d5f94ba5f482",
          "sectionLabel": "Transportation"
        },
        "elements": [
          {
            "elementId": "9fa3ab90-d76f-478e-a964-62da7e1ee7e5",
            "elementLabel": "Travel Mode"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d7d698b8-c4b8-4acc-94c2-027f405c830c",
          "sectionLabel": "Communication"
        },
        "elements": [
          {
            "elementId": "951a9d98-a29b-4445-8ecf-fa327d927c93",
            "elementLabel": "Manual Communication Mode"
          },
          {
            "elementId": "3233da55-cfd0-4890-a0b9-e625998f7384",
            "elementLabel": "Notes"
          },
          {
            "elementId": "cfc2b7c5-69e6-4a63-8ac2-8bdb187b5276",
            "elementLabel": "Additional Languages"
          },
          {
            "elementId": "8f51424f-3ea3-40bf-b94b-b47bf0d3729d",
            "elementLabel": "Primary Language"
          },
          {
            "elementId": "e95eec25-a3bb-46ca-b8bc-3ee5f9c90fa4",
            "elementLabel": "Written Communication Medium"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "3b85e1f3-b3d7-4ade-91f7-6a5646772330",
      "configLabel": "Benefits Info"
    },
    "sections": [
      {
        "section": {
          "sectionId": "c9bd63d4-d257-4548-9198-e704a4752918",
          "sectionLabel": "Current Benefits"
        },
        "elements": [
          {
            "elementId": "b817a6f7-c3dc-4131-a361-2ffaf80a9350",
            "elementLabel": "Check which benefits the applicant is currently receiving"
          },
          {
            "elementId": "9c3665a3-b2c4-4adb-9733-600355c61909",
            "elementLabel": "Has the applicant received a notice that the TANF will be exhausted within 24 months?"
          },
          {
            "elementId": "ac036c77-63bc-4dfc-8a66-8b67e731fd0c",
            "elementLabel": "Upload Benefits Documentation"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "3c3a0891-99f5-45ca-988f-b7dc53436a9b",
      "configLabel": "Disability Info"
    },
    "sections": [
      {
        "section": {
          "sectionId": "149e55c6-0ca1-45e7-88f5-cb8d0a96c311",
          "sectionLabel": "Primary Impairment"
        },
        "elements": [
          {
            "elementId": "5c0e24d7-f5ef-4735-bdb8-086d831b5563",
            "elementLabel": "Primary Impairment"
          },
          {
            "elementId": "dd172290-97dd-41ba-8b53-83d26a583238",
            "elementLabel": "Cause"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d005fcbc-6f60-480f-a5ae-aa65d67b6f22",
          "sectionLabel": "Secondary Impairment"
        },
        "elements": [
          {
            "elementId": "566bf55c-0bf5-4f0f-a76f-8a9264b1c0aa",
            "elementLabel": "Secondary Impairment"
          },
          {
            "elementId": "07b3e718-f587-492a-bcd8-f7c78c8c618c",
            "elementLabel": "Cause"
          }
        ]
      },
      {
        "section": {
          "sectionId": "cfb6d73b-7cf7-4987-af08-6a192de0f028",
          "sectionLabel": "Other Impairment"
        },
        "elements": [
          {
            "elementId": "553bba0a-789c-405b-9a72-9a21a4ebb76c",
            "elementLabel": "Other Impairment"
          },
          {
            "elementId": "4a0d3900-61c3-4fde-8b20-789dc82e5049",
            "elementLabel": "Cause"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7602889a-a5e2-4925-8040-185cda1e9b15",
          "sectionLabel": "Disability Notes"
        },
        "elements": [
          {
            "elementId": "c4406bc6-d8d5-442d-916c-29b6a5f499d3",
            "elementLabel": "Comments"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "958473fc-c090-4f58-b4a3-03509b48b4ad",
      "configLabel": "Education"
    },
    "sections": [
      {
        "section": {
          "sectionId": "832248a0-d155-4fb2-b263-096929927d33",
          "sectionLabel": "Current Education Status"
        },
        "elements": [
          {
            "elementId": "53dc9657-324d-4dfc-9236-5d7dcccf2894",
            "elementLabel": "Secondary Enrollment"
          },
          {
            "elementId": "db2fe963-f0ad-444e-b3fe-da2b0d5977ee",
            "elementLabel": "Post Secondary Enrollment"
          },
          {
            "elementId": "2c3a13cc-e0f1-4655-b7bb-506d051dd647",
            "elementLabel": "Enrolled in Recognized Secondary Equivalent"
          },
          {
            "elementId": "3f9c1d40-add6-4b16-9202-5323fd130af6",
            "elementLabel": "Enrollment Date"
          },
          {
            "elementId": "24836ce5-84a8-4891-85ea-fc6eee827e49",
            "elementLabel": "Latest Completion/Disenrollment Date"
          },
          {
            "elementId": "7f63c2de-ca18-471d-abd5-36e79ea0858d",
            "elementLabel": "Training Program"
          },
          {
            "elementId": "3351c85a-d9ff-46b2-94ec-41f68019ffde",
            "elementLabel": "Training Provider/ School/ Institution"
          },
          {
            "elementId": "8b62cbaa-d7df-474b-907a-28d2216ca0bd",
            "elementLabel": "Training Provider/ School/ Institution"
          },
          {
            "elementId": "f1d730e9-e657-4752-802e-5363428cd3c2",
            "elementLabel": "Training Provider/ School/ Institution"
          },
          {
            "elementId": "299f260e-1315-45e6-9514-f2960716ccca",
            "elementLabel": "Student with a Disability Status"
          },
          {
            "elementId": "5f858bff-1b44-4d6c-a083-40e53f007489",
            "elementLabel": "Postsecondary Education Status"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f0a48bf8-cbe1-45aa-b364-768f8a780bc4",
          "sectionLabel": "Credentials"
        },
        "elements": [
          {
            "elementId": "b1475480-9497-42c9-bceb-02b832019bf9",
            "elementLabel": "Special Education Certificate of Completion"
          },
          {
            "elementId": "b9c4c65a-b4d5-43d1-ba1b-b40cd2bb3819",
            "elementLabel": "Secondary School Diploma"
          },
          {
            "elementId": "e0cd7914-cf18-4bc5-90c5-717bd0380541",
            "elementLabel": "Recognized Secondary School Equivalency"
          },
          {
            "elementId": "fd7e982b-f909-4dbb-bc2a-5ac4a0403e89",
            "elementLabel": "Associate Degree"
          },
          {
            "elementId": "e97bf35a-94b0-4beb-8482-aca86b14f0bb",
            "elementLabel": "Bachelor's Degree"
          },
          {
            "elementId": "c3cf6591-dadf-4c0e-835c-e00f5fdce863",
            "elementLabel": "Master’s Degree"
          },
          {
            "elementId": "4039bb95-6d50-4a16-ac9c-6118c5ef0e81",
            "elementLabel": "Graduate Degree"
          },
          {
            "elementId": "bb07a1b5-a6ff-4152-b24e-fa16eb033790",
            "elementLabel": "Vocational/Technical License"
          },
          {
            "elementId": "f2f8d289-7169-4464-9e34-77869a0f8cde",
            "elementLabel": "Vocational/Technical Certificate or Certification"
          },
          {
            "elementId": "3828269f-95dc-4317-b4c5-8570c5fe9baf",
            "elementLabel": "Other Recognized Credential"
          }
        ]
      },
      {
        "section": {
          "sectionId": "a2c4386c-2111-4100-b9cf-e4faa41ce354",
          "sectionLabel": "Program Entry Status"
        },
        "elements": [
          {
            "elementId": "3b855d5d-93c1-4fd9-bdc3-143445e92b48",
            "elementLabel": "Highest Elementary or Secondary School Grade"
          },
          {
            "elementId": "4c7be305-854a-414e-83ee-b12c4bf0bd11",
            "elementLabel": "Postsecondary Degree"
          },
          {
            "elementId": "e821fca1-b57e-4677-bcf5-41b94f35094c",
            "elementLabel": "Date Last Attended"
          },
          {
            "elementId": "27e7c2b3-8500-47a1-8a9f-8505cd3b832e",
            "elementLabel": "Date Attained"
          },
          {
            "elementId": "c9b153ae-4f55-47c0-9001-46108b245c26",
            "elementLabel": "Secondary School Services Received/ receiving:"
          }
        ]
      },
      {
        "section": {
          "sectionId": "3a6cedd1-0a6c-4f67-a378-d6f9c33e2b8d",
          "sectionLabel": "Other Training"
        },
        "elements": [
          {
            "elementId": "138516d6-3f97-4f13-9f9a-d522abd08065",
            "elementLabel": "Vocational Skills"
          },
          {
            "elementId": "598f457c-4258-4f44-a2f8-7d7df005cb89",
            "elementLabel": "No Other Training"
          },
          {
            "elementId": "094ad45f-97d0-484c-a729-9d6402104191",
            "elementLabel": "Certification"
          },
          {
            "elementId": "ba2c1b30-afc2-4607-b1ea-46673adea436",
            "elementLabel": "Other Training"
          },
          {
            "elementId": "4d0efcb5-131c-4067-a744-b18f24efd360",
            "elementLabel": "Comments"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7312640e-90c3-4c5a-925f-646d91ff8fb6",
          "sectionLabel": "Skills"
        },
        "elements": [
          {
            "elementId": "03e46e69-4478-4b1f-823d-7cb020b9c12f",
            "elementLabel": "What self-reported skills does the applicant have?"
          },
          {
            "elementId": "100225f6-e292-4a78-bceb-33902f858364",
            "elementLabel": "Foreign Languages"
          },
          {
            "elementId": "ba7996ea-c5b8-4ce1-9930-269b2f5ad4c2",
            "elementLabel": "Preferred Mode of Learning"
          },
          {
            "elementId": "b0e1757f-55cc-48e3-9654-94f1fd543556",
            "elementLabel": "Comments"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "2712dab1-0490-41e9-ad07-3fab5b7d3e43",
      "configLabel": "Employment"
    },
    "sections": [
      {
        "section": {
          "sectionId": "b6ea2530-0f40-4ebf-94bf-36e8f914e69a",
          "sectionLabel": "Current Employment Status"
        },
        "elements": [
          {
            "elementId": "a3df9d9a-b6e1-4663-967d-8be24649db5b",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "ec76e4aa-28f5-4a19-ba7e-64ed58382f07",
            "elementLabel": "Is the individual currently employed?"
          },
          {
            "elementId": "ff5c2ce9-9f17-4489-b216-ea4fb671b288",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "c870834e-56c6-44b2-a566-d18e39d5f2a5",
            "elementLabel": "Current Employment Status 2019 WIOA Category"
          },
          {
            "elementId": "88e3310d-dea0-4e62-a5c5-c2b7cbc3415a",
            "elementLabel": "Primary Occupation"
          },
          {
            "elementId": "2f20531e-ee25-43e8-b514-cacfd3418623",
            "elementLabel": "Start Date"
          },
          {
            "elementId": "96996367-a8d7-4e5a-b563-f9595c1967b9",
            "elementLabel": "End Date"
          },
          {
            "elementId": "bcc0e110-59f7-4a44-a176-b593f70d0942",
            "elementLabel": "Hourly Wage"
          },
          {
            "elementId": "18a666a1-cc25-4b9b-86e3-17704b6e3d60",
            "elementLabel": "Hours Worked in a Week"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f749aa45-bf88-4dc2-8398-6fb6b83b9e47",
          "sectionLabel": "Employment at Plan"
        },
        "elements": [
          {
            "elementId": "a3df9d9a-b6e1-4663-967d-8be24649db5b",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "ff5c2ce9-9f17-4489-b216-ea4fb671b288",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "c870834e-56c6-44b2-a566-d18e39d5f2a5",
            "elementLabel": "Current Employment Status 2019 WIOA Category"
          },
          {
            "elementId": "bcc0e110-59f7-4a44-a176-b593f70d0942",
            "elementLabel": "Hourly Wage"
          },
          {
            "elementId": "18a666a1-cc25-4b9b-86e3-17704b6e3d60",
            "elementLabel": "Hours Worked in a Week"
          },
          {
            "elementId": "ec76e4aa-28f5-4a19-ba7e-64ed58382f07",
            "elementLabel": "Is the individual currently employed?"
          },
          {
            "elementId": "88e3310d-dea0-4e62-a5c5-c2b7cbc3415a",
            "elementLabel": "Primary Occupation"
          },
          {
            "elementId": "2f20531e-ee25-43e8-b514-cacfd3418623",
            "elementLabel": "Start Date"
          }
        ]
      },
      {
        "section": {
          "sectionId": "a5df48c3-acf0-459d-b563-7938faf9f12d",
          "sectionLabel": "Employment at Closed"
        },
        "elements": [
          {
            "elementId": "a3df9d9a-b6e1-4663-967d-8be24649db5b",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "ff5c2ce9-9f17-4489-b216-ea4fb671b288",
            "elementLabel": "Current Employment Status"
          },
          {
            "elementId": "c870834e-56c6-44b2-a566-d18e39d5f2a5",
            "elementLabel": "Current Employment Status 2019 WIOA Category"
          },
          {
            "elementId": "bcc0e110-59f7-4a44-a176-b593f70d0942",
            "elementLabel": "Hourly Wage"
          },
          {
            "elementId": "18a666a1-cc25-4b9b-86e3-17704b6e3d60",
            "elementLabel": "Hours Worked in a Week"
          },
          {
            "elementId": "ec76e4aa-28f5-4a19-ba7e-64ed58382f07",
            "elementLabel": "Is the individual currently employed?"
          },
          {
            "elementId": "88e3310d-dea0-4e62-a5c5-c2b7cbc3415a",
            "elementLabel": "Primary Occupation"
          },
          {
            "elementId": "2f20531e-ee25-43e8-b514-cacfd3418623",
            "elementLabel": "Start Date"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "6915288c-1909-49a0-8d2b-dd43444613b3",
      "configLabel": "Insurance Info"
    },
    "sections": [
      {
        "section": {
          "sectionId": "8a014993-6b88-406b-89a1-0aca69151e64",
          "sectionLabel": "Insurance Info"
        },
        "elements": [
          {
            "elementId": "999ca6e8-0116-47a2-9462-f80d4ab36b4c",
            "elementLabel": "What is the insurance coverage of the applicant?"
          },
          {
            "elementId": "7f37316e-a7c2-44b6-98e5-2095df480f56",
            "elementLabel": "Upload Insurance Documentation"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "d399b771-a18f-4a82-91d6-47a4a20bacb7",
      "configLabel": "Program Involvement"
    },
    "sections": [
      {
        "section": {
          "sectionId": "0aa08e06-cc1a-483d-8b2e-572a70ee4806",
          "sectionLabel": "Adult Program"
        },
        "elements": [
          {
            "elementId": "7b1eb171-4cc1-4471-aa3b-28b9c925341c",
            "elementLabel": "Did the individual receive career and training services as an adult from an American Job Center or similar workforce agency? (Adult Program)"
          }
        ]
      },
      {
        "section": {
          "sectionId": "00ec046f-126e-4a73-9030-0ee3813d1271",
          "sectionLabel": "Adult Education"
        },
        "elements": [
          {
            "elementId": "762634b9-f44a-42bf-8b04-5d58dc03f1a3",
            "elementLabel": "Did the individual receive services from the Adult Education program?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7d80aa9a-e998-42ce-86fc-944efb37f528",
          "sectionLabel": "Job Corps"
        },
        "elements": [
          {
            "elementId": "6cd57b67-eb4c-4a65-905c-10ff6c1728a1",
            "elementLabel": "Did the individual participate in a residential career training program when his or her age was between 16 and 24 years old? (Job Corps)"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f10e813d-3f68-400a-8dee-ad8a3a14bb67",
          "sectionLabel": "Dislocated Worker"
        },
        "elements": [
          {
            "elementId": "ef15b913-cf9d-487a-8a64-8474f70a95d0",
            "elementLabel": "Did the individual experience any of the following?\n- Laid off\n- Received notice of termination\n- Previously self-employed but had to close business"
          },
          {
            "elementId": "6b679854-89b8-4ecb-ac22-a37d9e136f83",
            "elementLabel": "Did the individual receive employment services from the Dislocated Worker Program at an American Job Center or similar workforce agency or community college after being laid off or losing employment?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "96750279-f8a4-4413-8a7b-a436634aeb55",
          "sectionLabel": "Vocational Rehabilitation"
        },
        "elements": [
          {
            "elementId": "300633aa-123d-4bd6-b7bc-7dc6ba72035f",
            "elementLabel": "If the individual is a veteran, did the individual participate in  the Veterans Affairs Vocational Rehab and Employment Program before? (2024 WIOA Category)"
          },
          {
            "elementId": "6bd49d18-1ce4-4797-be18-6c34716fc94d",
            "elementLabel": "From which vocational rehab agencies did the individual receive services?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "72279c79-0d08-4d0c-b26a-84bcd340b809",
          "sectionLabel": "Wagner-Peyser Employment Services"
        },
        "elements": [
          {
            "elementId": "4f3a3d5b-f522-4ada-a9f2-03b927584dc2",
            "elementLabel": "Did the individual receive any of the following employment services from an American Job Center or similar workforce agency? (Wagner-Peyser Prog.)\n- Job Search Assistance\n- Getting a job referral and placement assistance"
          }
        ]
      },
      {
        "section": {
          "sectionId": "29471e7b-c9aa-4b7c-843c-0f659749e500",
          "sectionLabel": "Youth"
        },
        "elements": [
          {
            "elementId": "17decb74-a42c-47b9-b6bc-fb004a796f55",
            "elementLabel": "Did the individual receive services as either an in-school youth or out of school youth to prepare for postsecondary education training and/or secure opportunities? (Youth Program)"
          }
        ]
      },
      {
        "section": {
          "sectionId": "61b5c563-c46e-464a-bc73-7a0c35a1bca3",
          "sectionLabel": "Youth Build"
        },
        "elements": [
          {
            "elementId": "1155bf97-fe3b-4b55-8432-3d3be5ed7f16",
            "elementLabel": "Did the individual participate in a Youth Build Program before? (2024 WIOA Category)"
          },
          {
            "elementId": "dee8b4e3-4155-496f-b1d6-e2cb424e61e5",
            "elementLabel": "Youth Build Grant number"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "0abe4588-7c21-4c25-98b4-b642ac05ef8a",
      "configLabel": "Eligibility Determination"
    },
    "sections": [
      {
        "section": {
          "sectionId": "27f098dd-9611-4e99-a25a-a21e29056bdb",
          "sectionLabel": "Eligibility Considerations"
        },
        "elements": [
          {
            "elementId": "87502c92-32d8-47a8-9394-ccfa4bef745a",
            "elementLabel": "The individual is currently working and requesting employment maintenance services."
          },
          {
            "elementId": "4a537db9-4cff-41c4-b70c-8af673e7aba6",
            "elementLabel": "The individual is presumed eligible due to receipt of SSI/SSDI benefits."
          }
        ]
      },
      {
        "section": {
          "sectionId": "dbfa6b3b-38a0-484d-abd8-d01af9a990f1",
          "sectionLabel": "Eligibility Criteria"
        },
        "elements": [
          {
            "elementId": "fc03721f-3457-400c-a461-90a5f1227d7a",
            "elementLabel": "Are VR services required for the individual to prepare for, enter, engage in or retain gainful employment?"
          },
          {
            "elementId": "e756cec7-c775-4b39-976e-d3222a260267",
            "elementLabel": "Does the physical or mental impairment constitute or result in a substantial impediments to employment for the individual?"
          },
          {
            "elementId": "da0aae41-5356-4589-92d8-2e7c4c7e353e",
            "elementLabel": "Does the individual intend to achieve an employment outcome - full or part time employment where the individual works in an integrated setting, receives competitive wages and has opportunities for advancement as their non-disabled peers?"
          },
          {
            "elementId": "4b3dadb3-cc72-431d-9b0d-a2cb88bab809",
            "elementLabel": "Is there documentation of the individual's physical or mental impairments?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "b965c360-93d3-4ac6-9923-659c05f32df5",
          "sectionLabel": "Eligibility Criteria 2"
        },
        "elements": [
          {
            "elementId": "ee8e9eba-b5aa-4b96-b4c3-404eb463cd03",
            "elementLabel": "Describe why VR Services are required for the individual to prepare for, enter, engage in or retain gainful employment:"
          },
          {
            "elementId": "9acc948d-081a-4a05-bf52-0d04889b3fbf",
            "elementLabel": "What are potential impediments to employment that apply to this applicant?"
          },
          {
            "elementId": "19d26027-7d0c-4d35-8ef8-3f83262431ed",
            "elementLabel": "What are data source/s used to review eligibility?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "137bd93f-500c-4a11-a9b6-cb76c8c0260d",
          "sectionLabel": "Eligibility Determination"
        },
        "elements": [
          {
            "elementId": "de17cb71-bc3f-46bf-afde-1656901d509e",
            "elementLabel": "Determination"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "84d7bc74-dc2d-4e92-b5b5-3a34810f6eea",
      "configLabel": "Employment Barriers"
    },
    "sections": [
      {
        "section": {
          "sectionId": "89d7fcad-361b-4e37-8d33-0df17fc42249",
          "sectionLabel": "Long - Term Unemployed"
        },
        "elements": [
          {
            "elementId": "9af25fae-3d13-4e2d-b1fc-97554cb065d0",
            "elementLabel": "Is the individual currently employed?"
          },
          {
            "elementId": "964f5b3c-377d-4a0b-b1b6-7412f571f086",
            "elementLabel": "Does the Individual have any prior work experience?"
          },
          {
            "elementId": "e9833823-0969-4a96-8659-e72013379065",
            "elementLabel": "End Date of Last Employment:"
          }
        ]
      },
      {
        "section": {
          "sectionId": "60a660d5-5f03-4b85-911d-87ed252e99da",
          "sectionLabel": "Exhausting TANF"
        },
        "elements": [
          {
            "elementId": "4ce8e088-17a3-4ac7-bc25-08a058efa49c",
            "elementLabel": "Receiving Temporary Assistance for Needy Families (TANF)?"
          },
          {
            "elementId": "75907771-c26f-4404-ab45-52046a6b7ef3",
            "elementLabel": "TANF Expiry notice received?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f5dbef51-ac53-43ce-98d2-b796e587b7fd",
          "sectionLabel": "Foster Care Youth "
        },
        "elements": [
          {
            "elementId": "e3325a83-994b-4574-9f48-6cd130c7493b",
            "elementLabel": "Is the Youth in Foster Care?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f58ab588-772a-47c7-9a51-7c1d16fd99b7",
          "sectionLabel": "Homeless Individual/ Children/ Youth"
        },
        "elements": [
          {
            "elementId": "24dd5bca-6d7a-47d5-9aad-156efa792ef6",
            "elementLabel": "Does the applicant go home to the same residence every night?"
          },
          {
            "elementId": "6494ed89-93f0-4ea5-93d9-2b480fee3df5",
            "elementLabel": "Living Arrangement"
          },
          {
            "elementId": "a8218c65-b71c-4862-9790-875eaa547512",
            "elementLabel": "Is the youth a dependent of a seasonal or migrant farmworker?"
          },
          {
            "elementId": "a087ebc3-71b9-432b-bcc7-8d58575af3a9",
            "elementLabel": "In the past 36 months, did this child/ youth experience moving from one school district to another due to changes in parents' seasonal employment in agriculture, dairy or fishing work?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "aac2b610-fce3-482e-bc40-2376664e915a",
          "sectionLabel": "Ex-Offender"
        },
        "elements": [
          {
            "elementId": "7493b8a1-17b1-4cd8-8482-d4c96304ddfe",
            "elementLabel": "Was the applicant ever involved in any stage of the criminal justice process for committing a status offense or delinquent act?"
          },
          {
            "elementId": "f88f9a6b-c3d5-460c-aee2-545d534e650d",
            "elementLabel": "Does the applicant have a record of arrest or conviction?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c77e5edc-feaa-42c9-9811-b5523cde21aa",
          "sectionLabel": "Low-Income"
        },
        "elements": [
          {
            "elementId": "06683e16-57ba-44be-bd7d-6b9f9099ae56",
            "elementLabel": "Benefits received:"
          },
          {
            "elementId": "6ff3ee7e-2ad0-445d-a72f-dc4dd5ced32b",
            "elementLabel": "Where does the applicant live?"
          },
          {
            "elementId": "3304f16e-cc79-4cb0-8a7b-543de84aab67",
            "elementLabel": "Did the youth run away from home?"
          },
          {
            "elementId": "2b7066e4-2599-4d6b-be57-03d568dd5c1d",
            "elementLabel": "Is the youth living in a high poverty area?"
          },
          {
            "elementId": "2a8dc027-b5d6-4c99-89cc-de6aa1e25b13",
            "elementLabel": "Is the Youth in Foster Care?"
          },
          {
            "elementId": "8fb1509a-2959-4104-b729-af9592d518ff",
            "elementLabel": "In the past 36 months, did this child/youth experience moving from one school district to another due to changes in parents' seasonal employment in agriculture, dairy or fishing work?"
          },
          {
            "elementId": "76254794-52dd-4ad8-a889-413b6fefcab7",
            "elementLabel": "Receiving or is eligible to receive free or reduced price lunch"
          }
        ]
      },
      {
        "section": {
          "sectionId": "b9d28b8e-c116-4367-9056-e6358870916d",
          "sectionLabel": "Basic Skills Deficient"
        },
        "elements": [
          {
            "elementId": "f66895e6-18d4-473e-b79f-430e66335f84",
            "elementLabel": "Speaking in English"
          },
          {
            "elementId": "452b2b1c-20f4-4079-906c-7de3d5f6b547",
            "elementLabel": "Reading in English"
          },
          {
            "elementId": "9d746537-f593-4762-a0b6-6911c3df5142",
            "elementLabel": "Writing in English"
          },
          {
            "elementId": "766d40a0-9843-4dbe-b25b-dcbabe1ba92e",
            "elementLabel": "Computing Skills and Problem Solving"
          }
        ]
      },
      {
        "section": {
          "sectionId": "86106949-1c26-4583-8046-8ac802db5c5b",
          "sectionLabel": "Cultural Barriers"
        },
        "elements": [
          {
            "elementId": "934989a7-4ac4-4c1f-a681-1da1ca7000d5",
            "elementLabel": "Does the individual possess attitudes, beliefs, customs or practices that influence a way of thinking, acting or working that may serve as a hindrance to employment?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "ba5fed4e-6203-4100-b7fa-58af9cf3f73e",
          "sectionLabel": "Displaced Homemaker"
        },
        "elements": [
          {
            "elementId": "2d9edc94-7123-4d05-a11e-6b31a9aa79fd",
            "elementLabel": "Is the individual a military spouse affected by relocation who is unemployed or underemployed and is experiencing difficulty in obtaining or upgrading employment"
          },
          {
            "elementId": "3aa1e6b6-e9fc-452a-866b-71d5c5063198",
            "elementLabel": "Is the individual a homemaker who used to rely on the income of a family member and is now not supported by that income due to divorce, separation or death?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "0d14bd96-6bb2-4b60-bc67-437b492bab47",
          "sectionLabel": "Single Parent"
        },
        "elements": [
          {
            "elementId": "130fd231-1e48-4b0a-91af-061134da614e",
            "elementLabel": "Marital Status"
          },
          {
            "elementId": "14a8dd44-aa7a-4bb3-a79e-b10cf0e1ddbd",
            "elementLabel": "Number of dependents"
          },
          {
            "elementId": "22bcf2b4-ad80-46df-8484-e999ac3e1835",
            "elementLabel": "Responsible for dependent children?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "0cec9a11-4638-4046-8554-29adb81cbb15",
          "sectionLabel": "Migrant and Seasonal Farmworker"
        },
        "elements": [
          {
            "elementId": "c3ed2a26-5042-4980-aaca-f0ade201f529",
            "elementLabel": "Is the youth a dependent of a seasonal or migrant farmworker?"
          },
          {
            "elementId": "2fd74ac7-003f-4d56-9fcc-75ad20025b1d",
            "elementLabel": "Is the individual engaged in agriculture or fish farming for the past 12 months?"
          },
          {
            "elementId": "fe96006b-c540-4e20-b486-dba3c31b4a9b",
            "elementLabel": "Is the individual a seasonal farmer who is required to travel to a job site that he is unable to return home in the same day?"
          },
          {
            "elementId": "ca8a3899-e26d-45ae-bde3-8e20b1ee0ddd",
            "elementLabel": "Does the individual face chronic unemployment or undemployment as a result of being engaged in agriculture or fish farming?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "fa55ee95-5deb-4026-bfd7-9079a42ecb9f",
          "sectionLabel": "English Language Learner"
        },
        "elements": [
          {
            "elementId": "2e7320c8-2efa-4241-9f90-62eeecf6ccfa",
            "elementLabel": "Primary Language"
          },
          {
            "elementId": "8d886747-fc0d-4142-b483-a2e2d94acb9c",
            "elementLabel": "Speaking in English"
          },
          {
            "elementId": "b54b4bbf-b2c7-4549-973d-9123bb93eae3",
            "elementLabel": "Reading in English"
          },
          {
            "elementId": "4248e83a-3f72-4c3c-a969-033af07a8aa4",
            "elementLabel": "Writing in English"
          },
          {
            "elementId": "ad3c9268-984d-4eb0-b876-4b3fda1cede7",
            "elementLabel": "Understanding in English"
          },
          {
            "elementId": "9255f320-39e9-4e6e-81bc-d7162bede99a",
            "elementLabel": "Does the individual have another language other than English?"
          },
          {
            "elementId": "39177163-1ff4-4570-9326-2cf4fac64013",
            "elementLabel": "Does the individual live in a family or community environment where a language other than English is the dominant language?"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "42bdbca9-8e19-4d79-ac72-f6e967383248",
      "configLabel": "Intake Information"
    },
    "sections": [
      {
        "section": {
          "sectionId": "57fbea83-01dd-4024-8ffb-d6f674ea4bec",
          "sectionLabel": "Identity Verification"
        },
        "elements": [
          {
            "elementId": "b09e51df-ebc4-4b92-ac4c-9d56fca42d2c",
            "elementLabel": "Intake Date"
          },
          {
            "elementId": "3b869f35-8a69-44f3-a3ed-678542e0b445",
            "elementLabel": "Proof of Identity"
          },
          {
            "elementId": "e928d98a-a994-47fe-a312-b782ec525d6e",
            "elementLabel": "Upload Identity Documentation"
          }
        ]
      },
      {
        "section": {
          "sectionId": "cc939f9a-c4e7-451f-868e-b4cece8e342d",
          "sectionLabel": "Household Information"
        },
        "elements": [
          {
            "elementId": "4f70c372-431d-47ef-b95a-de1c3f53d542",
            "elementLabel": "Marital Status"
          },
          {
            "elementId": "02ac7469-ba98-4cd8-8538-0e0e1e9ba0e8",
            "elementLabel": "Number of dependents"
          },
          {
            "elementId": "5d7ec1c9-b1de-488f-aed6-45e76203d3d6",
            "elementLabel": "Number of household members"
          }
        ]
      },
      {
        "section": {
          "sectionId": "ded211ff-21e6-43da-b0e9-8bdc5447b869",
          "sectionLabel": "Work Eligibility"
        },
        "elements": [
          {
            "elementId": "60fa7d4c-a526-4f79-8b19-8d2b4c3ba8c4",
            "elementLabel": "Work eligibility is based on"
          },
          {
            "elementId": "aff6db9d-c880-4abb-a7c5-bdf6c8bb1c8f",
            "elementLabel": "When subjected to an employment screening, the applicant"
          },
          {
            "elementId": "6ff04661-f65e-4ac7-820a-4d3f0766c48d",
            "elementLabel": "Work Eligibility documentation"
          },
          {
            "elementId": "9b3ccb2a-28c9-4c7e-b229-0a76c95e7724",
            "elementLabel": "Visa Type"
          },
          {
            "elementId": "572d83ac-a307-4636-a2af-dacc36ab784c",
            "elementLabel": "Work Permit Expiration"
          },
          {
            "elementId": "be5146a6-b96e-4ed6-8f1f-f945c879c42d",
            "elementLabel": "Work Permit Number"
          }
        ]
      },
      {
        "section": {
          "sectionId": "9a930619-f6ca-42ca-abd9-6b9348a32082",
          "sectionLabel": "Special Categories"
        },
        "elements": [
          {
            "elementId": "816fd372-db6f-40db-b3e6-662c82d5dfad",
            "elementLabel": "Voter status"
          },
          {
            "elementId": "38051b05-f2e1-4cf4-aff3-9ec9793c22bf",
            "elementLabel": "Voter documentation"
          },
          {
            "elementId": "046acd13-aa87-406b-a2f3-23d12b3ea5d0",
            "elementLabel": "Veteran status"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "f7690416-f792-4b5e-a00d-2bf5397dd672",
      "configLabel": "Referral Info"
    },
    "sections": [
      {
        "section": {
          "sectionId": "94dc205a-f36d-47dd-8ed2-d75c5c8ddb9b",
          "sectionLabel": "Referral Source"
        },
        "elements": [
          {
            "elementId": "19437478-5455-4ef0-8444-a6dadeb28472",
            "elementLabel": "Referral Source"
          }
        ]
      },
      {
        "section": {
          "sectionId": "817a879a-3711-45cb-98b9-d0753a9eb985",
          "sectionLabel": "Referral Reason"
        },
        "elements": [
          {
            "elementId": "1dab5d23-a7e9-40cb-958a-34a9d4970011",
            "elementLabel": "The applicant is interested in services to assist with"
          },
          {
            "elementId": "1e96d1de-2467-451c-a09a-97bf301c6b78",
            "elementLabel": "What is the applicant's expectation from the agency?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7bdcbf47-61c0-44dd-a2db-07eed05f5156",
          "sectionLabel": "Referring Party"
        },
        "elements": [
          {
            "elementId": "01f74703-2d8c-4831-bb64-31670cf35fd8",
            "elementLabel": "Name"
          },
          {
            "elementId": "19f569c3-aebc-492d-b475-087f5aceecca",
            "elementLabel": "Contact Type"
          },
          {
            "elementId": "b3e647f0-08ca-4d16-9703-805f5fa61ec5",
            "elementLabel": "Contact info"
          }
        ]
      },
      {
        "section": {
          "sectionId": "35332190-a40d-4cee-9546-ae7ae761ca32",
          "sectionLabel": "Service History"
        },
        "elements": [
          {
            "elementId": "d7fb1b4a-86df-48c0-b0d1-f9c6740072f8",
            "elementLabel": "What services, if any, did the applicant receive in the past or currently receiving from another agency?"
          },
          {
            "elementId": "5bd714b2-c51f-4bac-80c6-9e9922cf8403",
            "elementLabel": "Did the previous services result in going to work?"
          }
        ]
      },
      {
        "section": {
          "sectionId": "4acd2850-230a-4001-9ec3-d4ae347bd275",
          "sectionLabel": "Application Documents"
        },
        "elements": [
          {
            "elementId": "6621b661-ef84-495b-a27c-1d89d53c06d4",
            "elementLabel": "Upload Signed Application"
          },
          {
            "elementId": "8640bed7-7a16-4824-a9ba-45a21973145c",
            "elementLabel": "Upload Other Documents"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "5d72b276-f02f-4780-9c22-e37b757dbe13",
      "configLabel": "Workers Compensation"
    },
    "sections": [
      {
        "section": {
          "sectionId": "ee0f5fb8-3886-475a-add4-ca51e0ca8722",
          "sectionLabel": "Workers Comp"
        },
        "elements": [
          {
            "elementId": "6ad16901-8274-4c13-a7bb-809ae99b890e",
            "elementLabel": "Warrant Number"
          },
          {
            "elementId": "3284ae9a-77d1-4d0a-a7f7-36ab78c8a579",
            "elementLabel": "Warrant Date"
          },
          {
            "elementId": "782b53d5-ee30-45bf-86b2-ac0ccac2077c",
            "elementLabel": "Warrant Amount"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "be9a1955-bf38-4e09-bf2b-05f5f8f18667",
      "configLabel": "Closure Information"
    },
    "sections": [
      {
        "section": {
          "sectionId": "c070f300-5d66-48b4-acdd-7731a47c52b8",
          "sectionLabel": "Exit Reason"
        },
        "elements": [
          {
            "elementId": "1f9f7f60-2ebf-4ac6-b539-7900cf4265dd",
            "elementLabel": "Reason for Closure"
          },
          {
            "elementId": "2d8a7db7-cdf8-49fb-ba48-9302c7c5844a",
            "elementLabel": "Employment Status at Closure"
          },
          {
            "elementId": "cd030de0-2e81-4f82-b065-86774aff0677",
            "elementLabel": "Randolph Sheppard Employment"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f016fa3c-7b9e-49e7-ad16-1fbc6e6119af",
          "sectionLabel": "Ineligibility"
        },
        "elements": [
          {
            "elementId": "0fb4f430-e3ad-44e9-b401-2f14557532e7",
            "elementLabel": "Veteran"
          },
          {
            "elementId": "24de9dc6-403b-4e5c-98c4-2d6a57eb84f8",
            "elementLabel": "Functional Capacity Areas"
          }
        ]
      },
      {
        "section": {
          "sectionId": "67e16cac-c32e-463c-b126-97a0a264db85",
          "sectionLabel": "Eligibility Status"
        },
        "elements": [
          {
            "elementId": "44517e01-4e4d-4e50-a983-9e40ccd286be",
            "elementLabel": "Individual with a Disability"
          },
          {
            "elementId": "664f3190-eef3-4c28-aba5-821d3c7d4c35",
            "elementLabel": "Eligibility Status"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "b6a71c6c-925a-4bef-8391-78d333d7dc44",
      "configLabel": "Post-Exit"
    },
    "sections": [
      {
        "section": {
          "sectionId": "ffb46cf3-3b5f-40ee-934b-e04d4024bbaf",
          "sectionLabel": "Post-Exit Info Q1"
        },
        "elements": [
          {
            "elementId": "e1679e7f-0bd8-41d2-987f-b7f36f83e43c",
            "elementLabel": "Date of Enrollment"
          },
          {
            "elementId": "65fb682c-2021-447d-80f0-e72b0e589076",
            "elementLabel": "Program Enrollment"
          },
          {
            "elementId": "7b017f8a-e83d-4088-89b0-163d6c8a47b4",
            "elementLabel": "Date of Credential Attainment"
          },
          {
            "elementId": "e7e1ffbb-af1f-4a53-84bb-de5561e8db60",
            "elementLabel": "Credential Type"
          },
          {
            "elementId": "4d3970be-c37c-480c-aa83-aeb3bd9f7552",
            "elementLabel": "Employment (2024 WIOA Category)"
          },
          {
            "elementId": "c93cdaee-5d14-4e5c-afbf-d62bd86c6f51",
            "elementLabel": "Quarterly Wages"
          },
          {
            "elementId": "760df905-5fe7-4669-928f-5481996d726d",
            "elementLabel": "Employer"
          },
          {
            "elementId": "31256093-6448-4d82-aa19-851e897ed5e8",
            "elementLabel": "Comments"
          },
          {
            "elementId": "0dc35b19-af35-4127-91bf-25494fdb4e4a",
            "elementLabel": "Documentation"
          }
        ]
      },
      {
        "section": {
          "sectionId": "3ae025bf-d284-4489-aa9d-8289314f7ff6",
          "sectionLabel": "Post-Exit Info Q2"
        },
        "elements": [
          {
            "elementId": "32255d5a-6d25-4cc4-90d0-e782eb598177",
            "elementLabel": "Date of Enrollment"
          },
          {
            "elementId": "6ed25b4c-18db-4aff-8fd6-3ba9eb53f514",
            "elementLabel": "Program Enrollment"
          },
          {
            "elementId": "fab21781-c444-48b7-9a76-453005f9801e",
            "elementLabel": "Date of Credential Attainment"
          },
          {
            "elementId": "dbacd067-9bda-4302-b801-46e37b28752c",
            "elementLabel": "Credential Type"
          },
          {
            "elementId": "7cf67732-7000-4e42-997f-d264816216ab",
            "elementLabel": "Employment (2024 WIOA Category)"
          },
          {
            "elementId": "40a5b98a-89cf-40d4-9729-9124a79a0a29",
            "elementLabel": "Quarterly Wages"
          },
          {
            "elementId": "844cfc74-e81b-4957-9a2e-da4c9f7c2e44",
            "elementLabel": "Employer"
          },
          {
            "elementId": "f6339d52-b484-4ef5-860d-dd88e3224df6",
            "elementLabel": "Comments"
          },
          {
            "elementId": "452866e1-0f83-4cd2-901a-2880570022c3",
            "elementLabel": "Documentation"
          }
        ]
      },
      {
        "section": {
          "sectionId": "d3026904-1a90-4c90-acc5-5949f3943556",
          "sectionLabel": "Post-Exit Info Q3"
        },
        "elements": [
          {
            "elementId": "2055db72-5f0f-48a7-baea-988e0ebdd4e7",
            "elementLabel": "Date of Enrollment"
          },
          {
            "elementId": "72652872-7221-4b5f-bbc1-70290f67b26e",
            "elementLabel": "Program Enrollment"
          },
          {
            "elementId": "c295a163-8aa5-4c4f-85ba-bd6e24eb9cbf",
            "elementLabel": "Date of Credential Attainment"
          },
          {
            "elementId": "d717ca9d-b3a1-4ece-85cb-2561df487bda",
            "elementLabel": "Credential Type"
          },
          {
            "elementId": "98299c58-ee9e-4ecf-9ac0-c59035860c37",
            "elementLabel": "Employment (2024 WIOA Category)"
          },
          {
            "elementId": "022225f0-8e20-49b7-ba05-1ebe99ffc65b",
            "elementLabel": "Quarterly Wages"
          },
          {
            "elementId": "dfb84c83-f28e-4f6b-9404-016b6bf948a7",
            "elementLabel": "Employer"
          },
          {
            "elementId": "85b7027a-1091-48aa-9a01-b0313e36a174",
            "elementLabel": "Comments"
          },
          {
            "elementId": "d670d894-ad3e-48db-afcd-e137a8073fd0",
            "elementLabel": "Documentation"
          }
        ]
      },
      {
        "section": {
          "sectionId": "cdbe4fee-403c-4a2d-835c-384516b7fb9e",
          "sectionLabel": "Post-Exit Info Q4"
        },
        "elements": [
          {
            "elementId": "3da88755-4765-419b-9500-9624f049cf2e",
            "elementLabel": "Date of Enrollment"
          },
          {
            "elementId": "7ba3394b-3cc5-46d5-93cf-aa8e8b47fc92",
            "elementLabel": "Program Enrollment"
          },
          {
            "elementId": "2573d7b9-dcdb-4753-af9c-3f9b6d97ae60",
            "elementLabel": "Date of Credential Attainment"
          },
          {
            "elementId": "6ab15e4f-0a52-4fea-9f1b-3fc5697a85f3",
            "elementLabel": "Credential Type"
          },
          {
            "elementId": "cca7e619-90ee-481a-a89b-d7eaecae5b46",
            "elementLabel": "Employment (2024 WIOA Category)"
          },
          {
            "elementId": "1275af25-3c5c-42f8-a1ba-c9e7e6e52389",
            "elementLabel": "Quarterly Wages"
          },
          {
            "elementId": "d517c3c5-d3b7-4b3d-b4a5-86fca6c77edd",
            "elementLabel": "Employer"
          },
          {
            "elementId": "1a0f67b5-a61d-4903-9e43-4678c27e4057",
            "elementLabel": "Comments"
          },
          {
            "elementId": "9d1119b2-9733-452a-b32c-ad6b924238dc",
            "elementLabel": "Documentation"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "95070a82-d1b6-413b-9ee9-59db6697c3f6",
      "configLabel": "Student Info"
    },
    "sections": [
      {
        "section": {
          "sectionId": "b9c2227b-3680-4bef-93e9-22dc6128059c",
          "sectionLabel": "Student with a Disability"
        },
        "elements": [
          {
            "elementId": "c2f1abe7-4531-43ba-8f85-d1d1a741b8ea",
            "elementLabel": "Student with a Disability"
          },
          {
            "elementId": "10436eac-bfa9-48e7-9f93-f5b3456f07f5",
            "elementLabel": "Disability Documentation"
          },
          {
            "elementId": "b754d852-28f4-4b7b-ae28-020a12d832ff",
            "elementLabel": "Disability Attachment"
          }
        ]
      },
      {
        "section": {
          "sectionId": "9fd4f26f-3f2e-4b68-9550-bfcfb405ee91",
          "sectionLabel": "Program Info"
        },
        "elements": [
          {
            "elementId": "14280749-e691-4ab6-94d7-fbbb867a2fef",
            "elementLabel": "Training Provider/ School/ Institution"
          },
          {
            "elementId": "b4828235-4464-4e05-8a0a-e63c29e44e0e",
            "elementLabel": "Training Description"
          },
          {
            "elementId": "ad3603d3-dc23-45d4-9256-0a2201713da0",
            "elementLabel": "Enrollment Status"
          },
          {
            "elementId": "aa57cc67-10aa-45a9-95a3-e5ceee877756",
            "elementLabel": "Enrollment Status"
          },
          {
            "elementId": "16829914-8e44-4333-be6b-1884c7e70279",
            "elementLabel": "Enrollment Status"
          },
          {
            "elementId": "4190f6cd-b58d-4e7d-bdf3-b356a7a2f59f",
            "elementLabel": "Enrollment Date"
          },
          {
            "elementId": "19291308-bbd5-4afe-9fff-ce6c829e123c",
            "elementLabel": "Expected Program Completion/ Graduation"
          },
          {
            "elementId": "572f4d2f-cb53-4e98-b403-78d1b59d49af",
            "elementLabel": "Enrollment Attachment"
          }
        ]
      }
    ]
  },
  {
    "config": {
      "configId": "71703423-9837-42fa-baea-54499a2bde42",
      "configLabel": "Primary Record"
    },
    "sections": [
      {
        "section": {
          "sectionId": "37646b9e-497b-40b4-a676-2a8029751f3e",
          "sectionLabel": "Pre-ETS Start Date"
        },
        "elements": [
          {
            "elementId": "7c2a353c-5d3f-4beb-842a-8c3fe06c519a",
            "elementLabel": "DE 96"
          }
        ]
      },
      {
        "section": {
          "sectionId": "070b8d59-8734-45d7-955c-eb5a0ac91218",
          "sectionLabel": "Eligibility Status Extension"
        },
        "elements": [
          {
            "elementId": "8beb338b-7a56-4c6a-aea4-e6ee8abd5a69",
            "elementLabel": "DE 39"
          }
        ]
      },
      {
        "section": {
          "sectionId": "9e1ad9c7-abdd-43e7-af32-36c6245c223c",
          "sectionLabel": "Plan Status Extension"
        },
        "elements": [
          {
            "elementId": "d4acf627-1ca7-4e66-a100-ebb272367825",
            "elementLabel": "DE 399"
          }
        ]
      },
      {
        "section": {
          "sectionId": "f1392779-5975-4382-9010-2f908f8ab92a",
          "sectionLabel": "Initial IPE Date"
        },
        "elements": [
          {
            "elementId": "4e46df50-5c55-4ff1-9340-38e72faca57e",
            "elementLabel": "DE 398"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c33bd2f1-2c1d-4c36-ac29-3de8708305d3",
          "sectionLabel": "Initial Planned VR Service Date"
        },
        "elements": [
          {
            "elementId": "be3dcd30-8a2a-4335-9402-b475149bf0b1",
            "elementLabel": "DE 127"
          }
        ]
      },
      {
        "section": {
          "sectionId": "c1cefe1e-377a-4931-888e-db1faa019d03",
          "sectionLabel": "Trial Work Start Date"
        },
        "elements": [
          {
            "elementId": "286a52b6-28de-44e0-a43c-6ba90fc553db",
            "elementLabel": "DE 46"
          }
        ]
      },
      {
        "section": {
          "sectionId": "7ae075ca-6a35-4441-8d81-384d5911eb42",
          "sectionLabel": "Trial Work End Date"
        },
        "elements": [
          {
            "elementId": "7e779092-8587-4af8-b47c-cefae0011c47",
            "elementLabel": "DE 47"
          }
        ]
      }
    ]
  }
]