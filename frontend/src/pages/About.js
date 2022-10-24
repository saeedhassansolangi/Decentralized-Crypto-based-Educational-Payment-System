import React from "react";
import saeed from "../../public/saeed.jpeg";
import ahmed from "../../public/ahmed.jpg";
import anees from "../../public/anees.jpg";

const groups_members = [
  {
    name: "Saeed Hassan",
    profileURL: saeed,
  },

  {
    name: "Ahmed Ali",
    profileURL: ahmed,
  },
  {
    name: "Anees Ahmed",
    profileURL: anees,
  },
];

function About() {
  return (
    <div className="bg-color">
      <div className="container vh pt-5">
        <div className="my-auto mt-5">
          <div className="row pt-5">
            {groups_members.map((user) => (
              <div className="col-md-4 text-center" key={user.name}>
                <img
                  src={user.profileURL}
                  className="about-img-styles"
                  alt="saeed hassan"
                />
                <p className="about-txt-styles">{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
