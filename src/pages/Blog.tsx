import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts, blogCategories, type BlogPost, type BlogCategory } from "@/data/blogPosts";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Clock, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SeoAnalysisWidget } from "@/components/SeoAnalysisWidget";
import { SEOHead } from "@/components/SEOHead";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <>
      <SEOHead
        title="Roofing Blog - Expert Tips & Guides | Call Kaids Roofing"
        description="Expert roofing advice, maintenance tips, and industry insights for Melbourne homeowners. Professional guides on roof restoration, repairs, and protection."
        keywords="roofing blog, Melbourne roofing tips, roof maintenance guides, roofing advice, Call Kaids Roofing"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Roofing Insights & Expert Advice
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Professional tips, maintenance guides, and industry insights to help Melbourne homeowners protect their biggest investment.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/80 backdrop-blur-sm border-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4 bg-background/60 backdrop-blur-sm border-y border-primary/10">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="rounded-full"
              >
                All Articles ({blogPosts.length})
              </Button>
              {blogCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {category.icon} {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {selectedCategory === "all" && featuredPosts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Featured Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.slice(0, 3).map((post) => (
                  <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-background/50 border-primary/20">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <OptimizedImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button asChild size="sm" className="group-hover:translate-x-1 transition-transform">
                          <Link to={`/blog/${post.slug}`}>
                            Read More <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO Widget Section - Free Business Tool */}
        {selectedCategory === "all" && (
          <SeoAnalysisWidget />
        )}

        {/* All Posts Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {selectedCategory === "all" ? "All Articles" : 
               blogCategories.find(c => c.id === selectedCategory)?.name + " Articles"}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No articles found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 bg-background/80 border-primary/10">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <OptimizedImage
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        className={`absolute top-3 left-3 text-xs ${
                          blogCategories.find(c => c.id === post.category)?.color || 'bg-primary'
                        }`}
                      >
                        {blogCategories.find(c => c.id === post.category)?.icon} {blogCategories.find(c => c.id === post.category)?.name}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                        <span>{post.readTime} min</span>
                      </div>
                      <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-xs line-clamp-3">{post.excerpt}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          Read Article
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Service Area and Specialist Links */}
        <section className="py-12 px-4 bg-gradient-to-r from-secondary/10 to-primary/5">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Local Roofing Expertise Across Southeast Melbourne</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              <Link to="/services/roof-restoration-clyde-north" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-primary text-sm">Clyde North Roofing</p>
              </Link>
              <Link to="/services/roof-restoration-berwick" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-primary text-sm">Berwick Specialist</p>
              </Link>
              <Link to="/services/roof-painting-cranbourne" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-primary text-sm">Cranbourne Painting</p>
              </Link>
              <Link to="/services/leak-detection" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-primary text-sm">Leak Detection</p>
              </Link>
              <Link to="/emergency" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-roofing-emergency text-sm">Emergency Repairs</p>
              </Link>
              <Link to="/warranty" className="text-center p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                <p className="font-medium text-primary text-sm">10-Year Warranty</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
          <div className="container mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Professional Roofing Advice?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Don't let roofing problems become major expenses. Get expert advice and quality service from Melbourne's trusted roofing professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/book">Get Your Free Roof Assessment</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <a href="tel:0435900709">Call 0435 900 709</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}