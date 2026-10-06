import Hero from "./Hero";
import Result from "./Result";
import Footer from "../footer/footer";
import MovingTexts from "./MovingTexts";
import CommentCard from "./CommentCard";
import ProductCard from "./ProductCard";

const Main = () => {
  return (
    <>
      <Hero />
      <MovingTexts />
      <section
        id="feature"
        className=" w-full flex flex-col justify-center items-center pl-20 p-10 h-full  space-y-5"
      >
        <p className="w-full md:text-4xl text-3xl text-[#202020] font-bold text-left ">
          One platform, every retail
          <br /> decision.
        </p>
        <p className="w-full md:text-lg text-base text-gray-500">
          Six analysis modules that turn any CSV into answers. No data team
          required.
        </p>
        <div className="w-full  grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-items-center gap-5 h-full ">
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
      </section>
      <section id="insite" className="bg-[#202020] h-full w-full">
        <div className="grid md:grid-cols-2 gap-5 grid-cols-1 pl-20 p-15">
          <div className="flex flex-col  space-y-5">
            <p className="text-gray-500 text-base font-bold">RESULTS</p>
            <p className="lg:text-5xl md:text-4xl text-3xl font-bold text-white">
              Retailers don't need more data. They need fewer decisions, made
              right.
            </p>
            <p className="md:text-lg text-base text-gray-500 font-bold">
              Drop in a CSV, and pandas-powered analysis hands you one clear
              answer instead of forty spreadsheet tabs.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
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
        id="comment"
        className="p-15 pl-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5"
      >
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
      </section>
      <Footer />
    </>
  );
};

export default Main;
