import { Search, ShoppingBasket, Truck } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Browse Local Farms",
    description: "Find farms and farm stands near you with fresh, seasonal produce.",
  },
  {
    icon: ShoppingBasket,
    title: "Add to Cart",
    description: "Select your favorite items and add them to your basket.",
  },
  {
    icon: Truck,
    title: "Pick Up or Delivery",
    description: "Choose convenient pickup times or get it delivered to your door.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connecting you with local farmers has never been easier
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <step.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
