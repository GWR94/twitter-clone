export default (number, index) => [
    ["just now", "right now"],
    ["%ss", "in %ss"],
    ["1m", "in 1m"],
    ["%sm", "in %sm"],
    ["1h", "in 1h"],
    ["%sh", "in %sh"],
    ["1d", "in 1d"],
    ["%sd", "in %sd"],
    ["1w", "in 1w"],
    ["%sw", "in %sw"],
    ["1mo", "in 1mo"],
    ["%smo", "in %smo"],
    ["1yr", "in 1yr"],
    ["%syr", "in %syr"]
  ][index];