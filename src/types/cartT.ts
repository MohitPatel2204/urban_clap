type chartT = {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    borderColor?: string[] | string;
    backgroundColor?: string | string[];
    fill?: boolean;
    borderWidth?: number;
    tension?: number;
  }>;
};
export default chartT;