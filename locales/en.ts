import type { Dictionary } from "./pt-BR";

/**
 * TEXTS — ENGLISH
 * Must mirror the structure of pt-BR.ts (TypeScript enforces it).
 */
export const en: Dictionary = {
  meta: {
    title: "Mário Barman | Open bar & cocktail service for events",
    description:
      "Bar and cocktail service for weddings, sweet fifteen parties and events in Angra dos Reis, Rio de Janeiro, São Paulo, Paraty and nearby. Since 2022.",
    keywords: [
      "open bar",
      "event bartender",
      "wedding cocktail service",
      "open bar Brazil",
      "bartender Angra dos Reis",
      "bartender Paraty",
      "cocktail catering Rio de Janeiro",
    ],
  },

  common: {
    skipToContent: "Skip to content",
    placeholderPhoto: "Photo coming soon",
    placeholderBadge: "Sample",
    illustrative: "Illustrative image",
    close: "Close",
    previous: "Previous",
    next: "Next",
    andRegions: "and nearby",
  },

  nav: {
    home: "Home",
    about: "About",
    drinks: "Drinks",
    quote: "Quote",
    contact: "Contact",
    menu: "Menu",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    main: "Main navigation",
    language: "Language",
    switchTo: "View site in {language}",
    homeLink: "Mário Barman — back to top",
  },

  menu: {
    contactTitle: "Get in touch",
    followTitle: "Follow",
    regionsTitle: "Where we serve",
    cta: "Request a quote",
  },

  preloader: {
    label: "Preparing your drink",
  },

  hero: {
    eyebrow: "Open bar since 2022",
    headline: ["More than drinks,", "an experience."],
    subheadline:
      "Bar and cocktail service for weddings, sweet fifteen parties and events in Angra dos Reis, Rio, São Paulo, Paraty and nearby.",
    primaryCta: "Request a quote",
    secondaryCta: "Explore our drinks",
    featuredLabel: "Featured",
    ingredientsLabel: "Made with",
    viewDrink: "View details",
    previous: "Previous drink",
    next: "Next drink",
    slideStatus: "Drink {current} of {total}: {name}",
    scrollHint: "Scroll to discover",
  },

  marquee: [
    "Weddings",
    "Sweet fifteen parties",
    "Events",
    "Angra dos Reis",
    "Rio de Janeiro",
    "São Paulo",
    "Paraty",
  ],

  manifesto: {
    kicker: "Where craft meets hospitality",
    phrases: [
      ["Every drink is made", "with intention"],
      ["Our bar is built", "around your party"],
      ["A good toast", "is meant to be remembered"],
    ],
    cta: "Read our story",
    photos: [
      "Photo of the bar setup",
      "Photo of drink preparation",
      "Photo of guests toasting",
      "Close-up photo of a drink",
      "Photo of the team",
    ],
  },

  about: {
    heading: "The art of serving well",
    paragraphs: [
      "Since 2022, Mário Barman has brought open bar and cocktail service to weddings, sweet fifteen parties and events in Angra dos Reis, Rio de Janeiro, São Paulo, Paraty and nearby.",
      "Space reserved for the brand's story: how it all began, Mário's path behind the bar and what drives the team at every event.",
      "Every event gets a menu designed for its guests, a carefully set bar and a team that serves with attention to every detail.",
    ],
    signature: "Mário",
    signatureRole: "Founder and bartender",
    portrait: "Photo of Mário",
    facts: [
      { term: "Since 2022", detail: "Serving open bar and cocktails at events." },
      { term: "Where we serve", detail: "{regions} {andRegions}." },
      { term: "Which events", detail: "Weddings, sweet fifteen parties and events." },
    ],
  },

  pillars: {
    heading: "What makes the difference",
    items: ["Bar technique", "Fresh ingredients", "Flawless presentation", "Hospitality"],
    philosophy:
      "A great bar shows in more than the glass: it's in the short wait, the chat with each guest and a counter that always stays tidy.",
  },

  services: {
    heading: "What we bring to your event",
    intro: "Pick one format or combine several. Every proposal is built around your event.",
  },

  testimonials: {
    heading: "Who has toasted with us",
    note: "Sample testimonials — they will be replaced with real client reviews.",
    previous: "Previous testimonial",
    next: "Next testimonial",
    select: "View testimonial {index}: {name}",
  },

  firstSip: {
    top: "After",
    main: "the first sip",
    sub: "no one forgets the bar at the party.",
  },

  drinks: {
    headingStart: "Discover our",
    headingTag: "most",
    headingEnd: "loved drinks",
    intro: "A taste of what could be on the bar at your event.",
    note: "Illustrative drinks. The final menu is put together with you for each event.",
    swipeHint: "Swipe to see more",
    details: "View details",
    detailsOf: "View details of {name}",
    ingredients: "Ingredients",
    notes: "Additional information",
    category: "Category",
    categories: {
      classic: "Classic",
      signature: "Signature",
      brazilian: "Brazilian",
      zero: "Alcohol-free",
      sparkling: "Sparkling",
    },
    addToQuote: "Add to my quote",
    endCardTitle: "Build your event's drinks menu",
    endCardText: "Classics, signatures and alcohol-free options, chosen with you.",
    endCardCta: "Request a quote",
    interestedIn: "I'm interested in this drink: {name}",
  },

  signature: {
    ring: "For those who seek the extraordinary in every detail",
    rightLabel: "House signature",
    caption: "Classics done right, from the first order to the last.",
  },

  experience: {
    statement: ["It's not just what you drink.", "It's how you feel", "with every toast."],
    imageLabels: ["Guests toasting", "A drink being served"],
  },

  gallery: {
    heading: "Nights we've served",
    cta: "See more on Instagram",
  },

  quote: {
    heading: "Let's build the bar for your event",
    intro:
      "Tell us about your party. When you send it, WhatsApp opens with your message ready to go — just confirm.",
    steps: [
      { title: "Tell us about the event", text: "Date, venue, number of guests and what you picture for the bar." },
      { title: "Send it on WhatsApp", text: "Your message is formatted with every detail included." },
      { title: "Get your proposal", text: "We reply with a proposal made for your event." },
    ],
    directTitle: "Rather talk right away?",
    directCta: "Message us on WhatsApp",
    form: {
      title: "Quote request",
      name: { label: "Full name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "name@email.com" },
      phone: { label: "Phone / WhatsApp", placeholder: "+55 (24) 99999-9999" },
      eventType: {
        label: "Event type",
        placeholder: "Select",
        options: {
          wedding: "Wedding",
          fifteen: "Sweet fifteen party",
          events: "Events",
          birthday: "Birthday",
          other: "Other",
        },
      },
      date: { label: "Event date" },
      location: { label: "Event venue", placeholder: "City or venue name" },
      guests: { label: "Number of guests", placeholder: "e.g. 150" },
      services: { label: "Services you need", hint: "Choose as many as you like." },
      message: {
        label: "Message",
        optional: "optional",
        placeholder: "Tell us what you have in mind: party style, favorite drinks, schedule…",
      },
      requiredNote: "Fields marked * are required.",
      submit: "Send on WhatsApp",
      submitApi: "Send request",
      submitting: "Preparing your message…",
    },
    errors: {
      required: "Fill in this field.",
      email: "Enter a valid email, like name@email.com.",
      phone: "Enter a phone number with area code.",
      eventType: "Choose the event type.",
      date: "Choose today or a future date.",
      guests: "Enter a number between 1 and 5,000.",
      summary: "Check the highlighted fields to continue.",
    },
    success: {
      title: "Your message is ready on WhatsApp",
      text: "We opened WhatsApp with your quote request. If it didn't open, use the button below.",
      textApi: "We received your quote request. We'll be in touch soon.",
      reopen: "Open WhatsApp",
      again: "Send another request",
    },
    error: {
      title: "Your request wasn't sent",
      text: "Try again or message us directly on WhatsApp at {phone}.",
      retry: "Try again",
    },
    whatsapp: {
      greeting: "Hi Mário! I'd like a quote for my event.",
      labels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        eventType: "Event type",
        date: "Date",
        location: "Venue",
        guests: "Guests",
        services: "Services",
        message: "Message",
      },
      footer: "Sent from the website.",
    },
  },

  contact: {
    heading: "Shall we toast your next event?",
    intro: "Reach us on WhatsApp or Instagram. We reply as soon as we can.",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    email: "Email",
    phone: "Phone",
    regionsTitle: "We serve",
    quoteCta: "Request a quote",
    whatsappCta: "Message us on WhatsApp",
  },

  footer: {
    tagline: "Bar and cocktail service for events.",
    navigation: "Navigation",
    contact: "Contact",
    social: "Social",
    language: "Language",
    rights: "© {year} Mário Barman. All rights reserved.",
    responsibility: "Please drink responsibly. Alcohol sales to anyone under 18 are prohibited.",
    backToTop: "Back to top",
  },

  floating: {
    whatsapp: "Chat on WhatsApp",
  },
};
