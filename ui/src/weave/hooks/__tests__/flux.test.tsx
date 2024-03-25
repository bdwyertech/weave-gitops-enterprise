import { FluxObject } from "../../lib/objects";
import { flattenChildren } from "../flux";

describe("flattenChildren", () => {
  it("supports empty", () => {
    const empty: FluxObject[] = [];
    expect(flattenChildren(empty)).toEqual([]);
  });

  it("handles nested", () => {
    const nested = [
      {
        name: "1",
        children: [{ name: "2", children: [{ name: "3", children: [] }] }],
      },
    ];
    const flattened = flattenChildren(nested as unknown as FluxObject[]);
    expect(flattened[0]).toMatchObject({ name: "1" });
    expect(flattened[1]).toMatchObject({ name: "2" });
    expect(flattened[2]).toMatchObject({ name: "3" });
  });

  it("handles multiple", () => {
    const multiple = [
      { name: "1", children: [] },
      {
        name: "2",
        children: [
          { name: "3", children: [] },
          { name: "4", children: [] },
        ],
      },
    ];
    const flattened = flattenChildren(multiple as unknown as FluxObject[]);
    expect(flattened[0]).toMatchObject({ name: "1" });
    expect(flattened[1]).toMatchObject({ name: "2" });
    expect(flattened[2]).toMatchObject({ name: "3" });
    expect(flattened[3]).toMatchObject({ name: "4" });
  });

  it("breaks if the format changes", () => {
    // No children property suggests API has changed
    const invalid = [{ name: "1" }];
    expect(() => flattenChildren(invalid as FluxObject[])).toThrow(TypeError);
  });
});
