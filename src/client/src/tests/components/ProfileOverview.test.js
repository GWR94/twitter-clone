import React from "react";
import { shallow } from "enzyme";
import ProfileOverview from "../../components/ProfileOverview";

test("should render ProfileOverview component", () => {
    const wrapper = shallow(<ProfileOverview />);
    expect(wrapper).toMatchSnapshot();
});
