interface Issue {
  type: "ERROR"|"WARNING"|"RUNTIME ERROR"|"RUNTIME WARNING"|"TODO";
  filename: string;
  lineNumber: number;
  msg: string;
}