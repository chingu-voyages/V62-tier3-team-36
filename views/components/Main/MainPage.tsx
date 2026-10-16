import Hero from "./Hero";
import Result from "./Result";
import Footer from "../footer/footer";
import MovingTexts from "./MovingTexts";
import CommentCard from "./CommentCard";
import ProductCard from "./ProductCard";

const Main = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Hero />
      <MovingTexts />

      <section
        id="feature"
        className="w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-4">
            <p className="text-3xl font-bold tracking-tight text-[#202020] sm:text-4xl lg:text-5xl">
              One platform, every retail
              <span className="block">decision.</span>
            </p>

            <p className="max-w-2xl text-base text-gray-500 sm:text-lg">
              Six analysis modules that turn any CSV into answers. No data team
              required.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <ProductCard
              Number="01"
              title="Interactive Visual Dashboards"
              description="Transform complex numbers into clear, professional visual charts that make executive reporting and decision-making simple."
            />
            <ProductCard
              Number="02"
              title="Profit Margin Insights"
              description="Automatically calculate net profits and margins across individual products, categories, or regions to find your most lucrative items."
            />
            <ProductCard
              Number="03"
              title="Custom Retail Datasets"
              description="Seamlessly upload and clean your own CSV transaction logs with built-in error handling for dates, prices, and columns."
            />
          </div>
        </div>
      </section>

      <section
        id="insite"
        className="w-full bg-[#202020] py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center space-y-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
              Results
            </p>

            <p className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Retailers don't need more data. They need fewer decisions, made
              right.
            </p>

            <p className="text-base font-medium text-gray-400 sm:text-lg">
              Drop in a CSV, and pandas-powered analysis hands you one clear
              answer instead of forty spreadsheet tabs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Result
              rate="1 Min"
              description="Average time to upload and clean retail data"
            />
            <Result
              rate="100%"
              description="Visibility into item-level revenue and profit margins"
            />
            <Result
              rate="Custom"
              description="CSV support for daily, weekly, or monthly tracking"
            />
            <Result
              rate="Zero"
              description="Manual spreadsheet errors with automated calculations"
            />
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="w-full px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <CommentCard
              isblack={false}
              start_name="MK"
              full_name="Marta Kowalski"
              comment="We cut seasonal overstock by a third in the first quarter. The reorder alerts alone paid for the platform."
            />
            <CommentCard
              isblack={true}
              start_name="DR"
              full_name="Daniel Reyes"
              comment="you told us to discontinue 47 SKUs we'd been defending for years. Best decision we made all year."
            />
            <CommentCard
              isblack={false}
              start_name="AS"
              full_name="Amara Singh"
              comment="Pricing recommendations went from 'trust your gut' to 'trust the elasticity curve'. Our margin tells the story."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Main;
