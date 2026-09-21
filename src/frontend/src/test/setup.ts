import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose stable `data-ocid` hooks rather than
// `data-testid`, so point Testing Library's test-id queries at that attribute.
configure({ testIdAttribute: "data-ocid" });

// React Testing Library does not auto-clean when Vitest globals are disabled,
// so unmount between tests to keep the DOM isolated.
afterEach(() => {
  cleanup();
});
