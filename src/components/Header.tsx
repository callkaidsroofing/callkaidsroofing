import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { cn } from "@/lib/utils";
import callKaidsFullLogo from "@/assets/call-kaids-logo-slogan.png";

const topLevelLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Our Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
];

const serviceComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Roof Restoration",
    href: "/services/roof-restoration",
    description: "Complete transformation for tile roofs, restoring look and structural integrity.",
  },
  {
    title: "Roof Painting",
    href: "/services/roof-painting",
    description: "Premium coating to restore and protect your roof with lasting durability.",
  },
  {
    title: "Rebedding & Repointing",
    href: "/services/roof-repointing",
    description: "Critical repair to prevent leaks and secure ridge caps and tiles.",
  },
  {
    title: "Gutter Cleaning",
    href: "/services/gutter-cleaning",
    description: "Professional cleaning to prevent water damage and maintain drainage.",
  },
  {
    title: "Roof Leak Repairs",
    href: "/services/leak-detection",
    description: "Expert diagnosis and permanent repairs for any type of roof leak.",
  },
  {
    title: "Tile Replacement",
    href: "/services/tile-replacement",
    description: "Replace broken or damaged tiles to maintain roof integrity.",
  },
  {
    title: "Valley Iron Replacement",
    href: "/services/valley-iron-replacement",
    description: "Replace corroded valley irons to prevent water damage.",
  },
  {
    title: "General Roof Repairs",
    href: "/services/roof-repairs",
    description: "Expert repairs for all roofing issues, big or small.",
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-roofing-navy/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center z-10">
          <OptimizedImage
            src={callKaidsFullLogo}
            alt="Call Kaids Roofing - Professional Roofing, Melbourne Style"
            className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain hover:scale-105 transition-transform duration-300 max-w-[200px] sm:max-w-[250px] md:max-w-full"
            width={800}
            height={300}
          />
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </NavLink>
              </NavigationMenuItem>

              {/* Services Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <NavLink to="/services">Services</NavLink>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {serviceComponents.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {topLevelLinks.slice(1).map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavLink to={link.href}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {link.label}
                    </NavigationMenuLink>
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button
            asChild
            className="ml-2 bg-roofing-blue hover:bg-roofing-blue/90"
          >
            <NavLink to="/book">
              <Phone className="mr-2 h-4 w-4" />
              Get a Free Quote
            </NavLink>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="text-white bg-transparent border-white/50 hover:bg-white/10"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-roofing-navy text-white border-l-white/20">
              <nav className="flex flex-col gap-y-4 pt-10">
                <NavLink to="/" className="text-lg font-medium hover:text-roofing-blue">
                  Home
                </NavLink>

                {/* Collapsible Services Menu for Mobile */}
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium hover:text-roofing-blue">
                    <NavLink to="/services">Services</NavLink>
                    <ChevronDown className="h-5 w-5 ml-1" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 pt-2 flex flex-col gap-y-2">
                    {serviceComponents.map((s) => (
                      <NavLink
                        key={s.href}
                        to={s.href}
                        className="text-gray-300 text-base hover:text-roofing-blue"
                      >
                        {s.title}
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {topLevelLinks.slice(1).map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className="text-lg font-medium hover:text-roofing-blue"
                  >
                    {link.label}
                  </NavLink>
                ))}

                <Button
                  asChild
                  size="lg"
                  className="bg-roofing-blue hover:bg-roofing-blue/90 text-lg mt-4"
                >
                  <NavLink to="/book">
                    <Phone className="mr-2 h-5 w-5" />
                    Get a Free Quote
                  </NavLink>
                </Button>
                <p className="text-sm text-white/70">0435 900 709</p>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Helper component for the mega menu styling
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavLink
          to={href}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
