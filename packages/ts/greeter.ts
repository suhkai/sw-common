interface PageInfo {
    title: string;
    body: number;
  }
  
  type Page = "home" | "about" | "contact";
  
  const nav: Record<Page, Partial<PageInfo>> = {
    about: { title: "about" , body:0},
    contact: { title: "contact" },
    home: { title: "home" }
  };

  nav.about
