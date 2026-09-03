/* =====================================
LOCAL STORAGE
====================================== */

const STORAGE_KEY = "familyRelationshipNetwork";
const DEMO_INITIALIZED_KEY = "familyRelationshipNetworkDemoInitialized";

/* =====================================
Declarative WebMCP Form Annotation
====================================== */
function enableMCP() {
  
  const myForm = document.querySelector("#contactForm");

  if (!myForm) {
    console.error("Contact form #contactForm was not found.");
    return;
  }

  myForm.setAttribute("toolname", "supportRequestTool");

  myForm.setAttribute("tooldescription", "Submit a request for support.");

  console.log("MCP enabled on:", myForm);

}

document.addEventListener("DOMContentLoaded", () => {
  const enableMcpBtn = document.querySelector("#enableMcpBtn");

  if (enableMcpBtn) {
    enableMcpBtn.addEventListener("click", enableMCP);
  }
});

/* =====================================
Mock Data
====================================== */

function createMockData() {
  return [
    {
      id: "demo-you",
      firstName: "Alex",
      lastName: "Tan",
      dob: "1988-05-15",
      phone: "+65 9123 4567",
      email: "alex.tan@example.com",
      category: "family",
      relationship: "You",
      parentId: null,
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-father",
      firstName: "Michael",
      lastName: "Tan",
      dob: "1960-03-20",
      phone: "+65 9234 5678",
      email: "michael.tan@example.com",
      category: "family",
      relationship: "Father",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-mother",
      firstName: "Sarah",
      lastName: "Tan",
      dob: "1963-08-12",
      phone: "+65 9345 6789",
      email: "sarah.tan@example.com",
      category: "family",
      relationship: "Mother",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-brother",
      firstName: "Daniel",
      lastName: "Tan",
      dob: "1990-11-04",
      phone: "+65 9456 7890",
      email: "daniel.tan@example.com",
      category: "family",
      relationship: "Brother",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-sister",
      firstName: "Emily",
      lastName: "Tan",
      dob: "1992-07-18",
      phone: "+65 9567 8901",
      email: "emily.tan@example.com",
      category: "family",
      relationship: "Sister",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-grandfather",
      firstName: "Robert",
      lastName: "Tan",
      dob: "1935-01-10",
      phone: "",
      email: "",
      category: "family",
      relationship: "Grand Father",
      parentId: "demo-father",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-grandmother",
      firstName: "Margaret",
      lastName: "Tan",
      dob: "1938-06-25",
      phone: "",
      email: "",
      category: "family",
      relationship: "Grand Mother",
      parentId: "demo-father",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-son",
      firstName: "Ethan",
      lastName: "Tan",
      dob: "2018-09-03",
      phone: "",
      email: "",
      category: "family",
      relationship: "Son",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-daughter",
      firstName: "Sophia",
      lastName: "Tan",
      dob: "2021-02-14",
      phone: "",
      email: "",
      category: "family",
      relationship: "Daughter",
      parentId: "demo-you",
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-doctor",
      firstName: "James",
      lastName: "Lee",
      dob: "",
      phone: "+65 9678 1234",
      email: "james.lee@example.com",
      category: "professional",
      relationship: "Doctor",
      parentId: null,
      createdAt: new Date().toISOString(),
    },

    {
      id: "demo-lawyer",
      firstName: "Rachel",
      lastName: "Lim",
      dob: "",
      phone: "+65 9789 2345",
      email: "rachel.lim@example.com",
      category: "professional",
      relationship: "Lawyer",
      parentId: null,
      createdAt: new Date().toISOString(),
    },
  ];
}

function initializeDemoData() {
  const existingData = localStorage.getItem(STORAGE_KEY);
  const demoInitialized = localStorage.getItem(DEMO_INITIALIZED_KEY);

  if (!existingData && !demoInitialized) {
    const mockData = createMockData();

    saveContacts(mockData);

    localStorage.setItem(DEMO_INITIALIZED_KEY, "true");

    return true;
  }

  return false;
}

/* =====================================
DOM ELEMENTS
====================================== */

const addContactBtn = document.getElementById("addContactBtn");
const contactFormCard = document.getElementById("contactFormCard");
const contactForm = document.getElementById("contactForm");
const cancelBtn = document.getElementById("cancelBtn");

const category = document.getElementById("category");
const relationship = document.getElementById("relationship");
const connectedPerson = document.getElementById("connectedPerson");

const connectionSection = document.getElementById("connectionSection");
const connectionHelp = document.getElementById("connectionHelp");
const categoryDescription = document.getElementById("categoryDescription");

const relationshipTree = document.getElementById("relationshipTree");
const emptyState = document.getElementById("emptyState");

const notification = document.getElementById("notification");
const clearBtn = document.getElementById("clearBtn");

/* =====================================
RELATIONSHIP OPTIONS
====================================== */

const familyRelationships = [
  "You",
  "Father",
  "Mother",
  "Brother",
  "Sister",
  "Grand Father",
  "Grand Mother",
  "Son",
  "Daughter",
];

const professionalRelationships = ["Doctor", "Lawyer"];

/* =====================================
FAMILY RELATIONSHIP LEVEL CHANGES

Father/Mother = one level above
Grand Father/Mother = one level above
Brother/Sister = same level
Son/Daughter = one level below
====================================== */

const relationshipDelta = {
  Father: -1,
  Mother: -1,
  Brother: 0,
  Sister: 0,
  "Grand Father": -1,
  "Grand Mother": -1,
  Son: 1,
  Daughter: 1,
};

/* =====================================
SHOW FORM
====================================== */

function openAddContactForm() {
  contactFormCard.classList.add("active");

  updateConnectedPersonDropdown();

  window.scrollTo({
    top: contactFormCard.offsetTop - 20,
    behavior: "smooth",
  });

  return {
    success: true,
    message: "Add contact form is now open.",
  };
}

// Existing button behavior
addContactBtn.addEventListener("click", () => {
  openAddContactForm();
});

// Expose the same action to AI agents through WebMCP
if ("modelContext" in document) {
  document.modelContext.registerTool({
    name: "open_add_contact_form",
    title: "Open Add Contact Form",
    description:
      "Open the Add Contact form so the user can enter a new contact.",

    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },

    annotations: {
      readOnlyHint: false,
    },

    execute: async () => {
      return openAddContactForm();
    },
  });
}

/* =====================================
CANCEL
====================================== */

function cancelAddContactForm() {
  resetForm();
  contactFormCard.classList.remove("active");

  return {
    success: true,
    message: "Add contact form was cancelled and reset.",
  };
}

// Existing button behavior
cancelBtn.addEventListener("click", () => {
  cancelAddContactForm();
});

// Expose the action through WebMCP
if ("modelContext" in document) {
  document.modelContext.registerTool({
    name: "cancel_add_contact",
    title: "Cancel Add Contact",
    description:
      "Cancel the Add Contact form, reset all entered contact information, and close the form.",

    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },

    annotations: {
      readOnlyHint: false,
    },

    execute: async () => {
      return cancelAddContactForm();
    },
  });
}

/* =====================================
RESET FORM
====================================== */

function resetForm() {
  contactForm.reset();

  relationship.innerHTML = '<option value="">Select Relationship</option>';

  categoryDescription.textContent = "";

  connectionHelp.textContent = "";
  connectionHelp.classList.remove("show");

  connectedPerson.innerHTML =
    '<option value="">No existing connection</option>';

  connectedPerson.disabled = false;
}

/* =====================================
CATEGORY CHANGE
====================================== */

category.addEventListener("change", () => {
  const selectedCategory = category.value;

  relationship.innerHTML = '<option value="">Select Relationship</option>';

  categoryDescription.textContent = "";

  connectionHelp.textContent = "";
  connectionHelp.classList.remove("show");

  if (selectedCategory === "family") {
    familyRelationships.forEach((item) => {
      const option = document.createElement("option");

      option.value = item;
      option.textContent = item;

      relationship.appendChild(option);
    });

    categoryDescription.textContent =
      "Select You to create the main profile. All other family members must be connected to an existing family member.";

    updateConnectedPersonDropdown();
  }

  if (selectedCategory === "professional") {
    professionalRelationships.forEach((item) => {
      const option = document.createElement("option");

      option.value = item;
      option.textContent = item;

      relationship.appendChild(option);
    });

    categoryDescription.textContent =
      "Professional contacts are maintained separately from the family relationship tree.";

    connectedPerson.innerHTML =
      '<option value="">No existing connection</option>';

    connectedPerson.disabled = true;
  }
});

/* =====================================
RELATIONSHIP CHANGE
====================================== */

relationship.addEventListener("change", () => {
  const selectedRelationship = relationship.value;

  if (
    category.value === "family" &&
    selectedRelationship !== "You" &&
    selectedRelationship !== ""
  ) {
    updateConnectedPersonDropdown();

    connectionHelp.textContent =
      "Select the family member this person is related to. For example, connect Father to You, then connect Grand Father to Father.";

    connectionHelp.classList.add("show");
  } else {
    connectionHelp.textContent = "";
    connectionHelp.classList.remove("show");
  }
});

/* =====================================
GET CONTACTS
====================================== */

function getContacts() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Invalid local storage data:", error);

    return [];
  }
}

/* =====================================
SAVE CONTACTS
====================================== */

function saveContacts(contacts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

/* =====================================
CREATE UNIQUE ID
====================================== */

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

/* =====================================
FIND YOU
====================================== */

function getYou(contacts) {
  return (
    contacts.find(
      (person) => person.category === "family" && person.relationship === "You",
    ) || null
  );
}

/* =====================================
UPDATE CONNECTED PERSON DROPDOWN
====================================== */

function updateConnectedPersonDropdown() {
  const contacts = getContacts();

  connectedPerson.innerHTML = '<option value="">Select family member</option>';

  const familyContacts = contacts.filter(
    (person) => person.category === "family",
  );

  familyContacts.forEach((person) => {
    const option = document.createElement("option");

    option.value = person.id;

    option.textContent = `${person.firstName} ${person.lastName} (${person.relationship})`;

    connectedPerson.appendChild(option);
  });

  if (relationship.value === "You") {
    connectedPerson.innerHTML =
      '<option value="">Not required for You</option>';

    connectedPerson.disabled = true;
  } else if (category.value === "professional") {
    connectedPerson.innerHTML =
      '<option value="">No existing connection</option>';

    connectedPerson.disabled = true;
  } else {
    connectedPerson.disabled = false;
  }
}

/* =====================================
VALIDATE FAMILY CONNECTION
====================================== */

function validateFamilyRelationship(contacts, selectedRelationship, parentId) {
  const you = getYou(contacts);

  /* YOU */

  if (selectedRelationship === "You") {
    if (you) {
      return {
        valid: false,
        message:
          "A You profile already exists. Only one You profile is allowed.",
      };
    }

    if (parentId) {
      return {
        valid: false,
        message:
          "You must be the root person and cannot be connected to another family member.",
      };
    }

    return {
      valid: true,
    };
  }

  /* OTHER FAMILY MEMBERS */

  if (!you) {
    return {
      valid: false,
      message:
        "Please create the 'You' profile first. All family relationships are built from the You profile.",
    };
  }

  if (!parentId) {
    return {
      valid: false,
      message: "Please select the family member this person is connected to.",
    };
  }

  const parent = contacts.find((person) => person.id === parentId);

  if (!parent) {
    return {
      valid: false,
      message: "The selected family member could not be found.",
    };
  }

  return {
    valid: true,
  };
}

/* =====================================
SAVE NEW CONTACT
====================================== */

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const contacts = getContacts();

  const firstName = document.getElementById("firstName").value.trim();

  const lastName = document.getElementById("lastName").value.trim();

  const dob = document.getElementById("dob").value;

  const phone = document.getElementById("phone").value.trim();

  const email = document.getElementById("email").value.trim();

  const selectedCategory = category.value;
  const selectedRelationship = relationship.value;

  const parentId = connectedPerson.value || null;

  /* Basic validation */

  if (!firstName || !lastName) {
    showNotification("Please enter first and last name.", true);

    return;
  }

  if (!selectedCategory || !selectedRelationship) {
    showNotification("Please select category and relationship.", true);

    return;
  }

  /* FAMILY VALIDATION */

  if (selectedCategory === "family") {
    const validation = validateFamilyRelationship(
      contacts,
      selectedRelationship,
      parentId,
    );

    if (!validation.valid) {
      showNotification(validation.message, true);

      return;
    }
  }

  /* Prevent duplicate You */

  if (
    selectedCategory === "family" &&
    selectedRelationship === "You" &&
    getYou(contacts)
  ) {
    showNotification("A You profile already exists.", true);

    return;
  }

  /* Create contact */

  const newContact = {
    id: createId(),

    firstName,
    lastName,
    dob,
    phone,
    email,

    category: selectedCategory,
    relationship: selectedRelationship,

    parentId: selectedCategory === "family" ? parentId : null,

    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);

  saveContacts(contacts);

  /* Reset UI */

  resetForm();

  contactFormCard.classList.remove("active");

  updateConnectedPersonDropdown();

  renderRelationshipTree();

  showNotification("Contact saved successfully!");
});

/* =====================================
GET INITIALS
====================================== */

function getInitials(person) {
  const first = person.firstName ? person.firstName.charAt(0) : "";

  const last = person.lastName ? person.lastName.charAt(0) : "";

  return (first + last).toUpperCase();
}

/* =====================================
CREATE PERSON CARD
====================================== */

function createPersonCard(person, isRoot = false) {
  const card = document.createElement("div");

  card.className = "person-card";

  if (isRoot) {
    card.classList.add("root");
  }

  if (person.category === "professional") {
    card.classList.add("professional-card");
  }

  const avatar = document.createElement("div");

  avatar.className = "person-avatar";

  avatar.textContent = getInitials(person);

  const name = document.createElement("h4");

  name.textContent = `${person.firstName} ${person.lastName}`;

  const relationshipLabel = document.createElement("span");

  relationshipLabel.className = "relationship";

  relationshipLabel.textContent = isRoot ? "You" : person.relationship;

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(relationshipLabel);

  if (person.phone || person.email) {
    const contact = document.createElement("div");

    contact.className = "person-contact";

    if (person.phone) {
      const phone = document.createElement("div");

      phone.textContent = "☎ " + person.phone;

      contact.appendChild(phone);
    }

    if (person.email) {
      const email = document.createElement("div");

      email.textContent = "✉ " + person.email;

      contact.appendChild(email);
    }

    card.appendChild(contact);
  }

  return card;
}

/* =====================================
CALCULATE FAMILY LEVELS

You = 0
Father/Mother = connected person's level - 1
Grand Father/Mother = connected person's level - 1
Brother/Sister = connected person's level
Son/Daughter = connected person's level + 1
====================================== */

function calculateFamilyLevels(contacts) {
  const familyContacts = contacts.filter(
    (person) => person.category === "family",
  );

  const you = getYou(contacts);

  if (!you) {
    return {};
  }

  const levels = {};
  const levelById = {};

  levelById[you.id] = 0;

  let changed = true;

  while (changed) {
    changed = false;

    familyContacts.forEach((person) => {
      if (levelById[person.id] !== undefined) {
        return;
      }

      if (!person.parentId) {
        return;
      }

      const connectedPerson = familyContacts.find(
        (parent) => parent.id === person.parentId,
      );

      if (!connectedPerson) {
        return;
      }

      const parentLevel = levelById[connectedPerson.id];

      if (parentLevel === undefined) {
        return;
      }

      let delta = relationshipDelta[person.relationship];

      if (
        person.relationship === "Grand Father" ||
        person.relationship === "Grand Mother"
      ) {
        delta = -1;
      }

      levelById[person.id] = parentLevel + delta;

      changed = true;
    });
  }

  Object.keys(levelById).forEach((id) => {
    const person = familyContacts.find((item) => item.id === id);

    if (!person) {
      return;
    }

    const level = levelById[id];

    if (!levels[level]) {
      levels[level] = [];
    }

    levels[level].push(person);
  });

  return levels;
}

/* =====================================
RENDER RELATIONSHIP TREE
====================================== */

function renderRelationshipTree() {
  const contacts = getContacts();

  relationshipTree.innerHTML = "";

  /* No contacts */

  if (contacts.length === 0) {
    emptyState.style.display = "block";

    relationshipTree.style.display = "none";

    return;
  }

  emptyState.style.display = "none";

  relationshipTree.style.display = "flex";

  /* FAMILY */

  const you = getYou(contacts);

  if (you) {
    const levels = calculateFamilyLevels(contacts);

    const sortedLevels = Object.keys(levels)
      .map(Number)
      .sort((a, b) => a - b);

    sortedLevels.forEach((levelNumber) => {
      const level = document.createElement("div");

      level.className = "tree-level";

      levels[levelNumber].forEach((person) => {
        const isYou = person.id === you.id;

        level.appendChild(createPersonCard(person, isYou));
      });

      relationshipTree.appendChild(level);
    });
  } else {
    /* No You profile */

    const message = document.createElement("div");

    message.className = "empty-state";

    message.innerHTML = `
            <div class="empty-state-icon">👤</div>
            <h3>Create your "You" profile first</h3>
            <p>
                The family tree starts with the person
                marked as "You".
            </p>
        `;

    relationshipTree.appendChild(message);
  }

  /* PROFESSIONAL CONTACTS */

  const professionalContacts = contacts.filter(
    (person) => person.category === "professional",
  );

  if (professionalContacts.length > 0) {
    const professionalSection = document.createElement("div");

    professionalSection.className = "professional-section";

    const professionalTitle = document.createElement("div");

    professionalTitle.className = "professional-title";

    professionalTitle.textContent = "Professional Connections";

    professionalSection.appendChild(professionalTitle);

    const professionalLevel = document.createElement("div");

    professionalLevel.className = "tree-level";

    professionalContacts.forEach((person) => {
      professionalLevel.appendChild(createPersonCard(person));
    });

    professionalSection.appendChild(professionalLevel);

    relationshipTree.appendChild(professionalSection);
  }
}

/* =====================================
NOTIFICATION
====================================== */

function showNotification(message, isError = false) {
  notification.textContent = message;

  notification.style.background = isError ? "#dc2626" : "#16a34a";

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

/* =====================================
CLEAR ALL
====================================== */

clearBtn.addEventListener("click", () => {
  const contacts = getContacts();

  if (contacts.length === 0) {
    return;
  }

  const confirmed = confirm("Are you sure you want to delete all contacts?");

  if (!confirmed) {
    return;
  }
  clearAllContacts();
});

function clearAllContacts() {
  localStorage.removeItem(STORAGE_KEY);

  resetForm();
  renderRelationshipTree();
  updateConnectedPersonDropdown();

  showNotification("All contacts have been deleted.");
}

// WebMCP Imperative API
if (document.modelContext) {
  document.modelContext.registerTool({
    name: "clear_all_contacts",

    title: "Clear all contacts",

    description:
      "Permanently delete all contacts from the contact list. " +
      "This is a destructive action and cannot be undone.",

    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },

    annotations: {
      readOnlyHint: false,
    },

    execute: async () => {
      const contacts = getContacts();

      if (contacts.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "There are no contacts to delete.",
            },
          ],
        };
      }

      clearAllContacts();

      return {
        content: [
          {
            type: "text",
            text: `Successfully deleted ${contacts.length} contact(s).`,
          },
        ],
      };
    },
  });
}

/* =====================================
INITIALIZE
====================================== */

document.addEventListener("DOMContentLoaded", () => {
  initializeDemoData();

  updateConnectedPersonDropdown();

  renderRelationshipTree();
});
