import "@testing-library/jest-dom/";
import { areObjectsEqual, deepSortObjectByEntries } from "../../utils/utils";
import { expectedJson, orderedFilterObj, unorderedFilterObj } from "../../mocks/filter-mocks";

describe("deepSortObjectByEntries", () => {
  it("should properly deepsort a complex object", () => {
    expect(JSON.stringify(deepSortObjectByEntries(unorderedFilterObj))).toBe(expectedJson);
  });
});

describe("areObjectsEqual", () => {
  fit("should return true with two objects whose properties are in different alphabetical order", () => {
    expect(areObjectsEqual(unorderedFilterObj, orderedFilterObj, ["index", "filterName"])).toBe(true);
  });
});
