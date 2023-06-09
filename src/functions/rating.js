import StarRating from "react-star-ratings";

export const showAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings; //product.ratings : [{...},{...},...] in db
    let total = []; // empty []
    let length = ratingsArray.length; // how many obj in product.ratings[{...},{...},...]
    console.log("ratingsArray", ratingsArray);
    console.log("length", length);

    ratingsArray.map((r) => total.push(r.star)); // in [ratingArrray], each r=rating push to total, only push star
    //how reduce work:
    //let say [1,4,6,7]
    //p=prev n=next
    //1st iteration 1 + 4 =5
    //2nd iteration 5 + 6 = 11
    //3rd iteration 11 + 7 =18
    let totalReduced = total.reduce((p, n) => p + n, 0); // 0 = initial value
    console.log("totalReduced", totalReduced);

    let highest = length * 5;
    console.log("highest", highest);

    //how to take the average. let say:
    // total = [3,3,3]
    //so totalReduced = 9
    //result:(9*5)/15 = 3
    //so average star = 3
    let result = (totalReduced * 5) / highest;
    console.log("result", result);

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            starSpacing="2px"
            starRatedColor="yellow"
            rating={result}
            editing={false}
          />{" "}
          ({p.ratings.length})
        </span>
      </div>
    );
  }
};
