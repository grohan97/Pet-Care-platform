import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gray-500 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything Your Pet Needs
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            Discover premium pet products, from nutritious food to comfortable accessories.
            Your one-stop destination for all pet care needs.
          </p>
          <div className="mt-10">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Shop by Category
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative w-full h-80 bg-white group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 lg:aspect-w-1 lg:aspect-h-1">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="px-4 py-3">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={category.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.name}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Featured Products
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-500">
              We're dedicated to providing the best care for your pets
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// Sample data (will be replaced with actual data from the database)
const categories = [
  {
    name: "Pet Food",
    description: "Premium nutrition for your pets",
    imageUrl: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd",
    href: "/categories/pet-food",
  },
  {
    name: "Grooming",
    description: "Keep your pets clean and healthy",
    imageUrl: "https://images.unsplash.com/photo-1516734212186-65266f46771f",
    href: "/categories/grooming",
  },
  {
    name: "Accessories",
    description: "Essential accessories for your pets",
    imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
    href: "/categories/accessories",
  },
  {
    name: "Healthcare",
    description: "Medical supplies and supplements",
    imageUrl: "https://images.unsplash.com/photo-1628009368231-7bb7087b1815",
    href: "/categories/healthcare",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    category: "Pet Food",
    price: 999,
    imageSrc: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd",
    imageAlt: "Premium dog food package.",
  },
  {
    id: 2,
    name: "Cat Grooming Kit",
    category: "Grooming",
    price: 799,
    imageSrc: "https://images.unsplash.com/photo-1516734212186-65266f46771f",
    imageAlt: "Complete cat grooming kit.",
  },
  {
    id: 3,
    name: "Pet Bed",
    category: "Accessories",
    price: 1499,
    imageSrc: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
    imageAlt: "Comfortable pet bed.",
  },
  {
    id: 4,
    name: "Multivitamin Supplements",
    category: "Healthcare",
    price: 599,
    imageSrc: "https://images.unsplash.com/photo-1628009368231-7bb7087b1815",
    imageAlt: "Pet vitamin supplements.",
  },
];

const features = [
  {
    name: "Quality Products",
    description: "We source only the highest quality products for your pets.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
  },
  {
    name: "Fast Delivery",
    description: "Get your pet supplies delivered quickly to your doorstep.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    name: "Expert Support",
    description: "Get advice from our pet care experts whenever you need.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
];
