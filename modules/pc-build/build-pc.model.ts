export interface BuildPcProduct {
  productId: string;
  quantity?: number; // opcional, default 1
}

export interface AddBuildPcInput {
  products: BuildPcProduct[];
}
