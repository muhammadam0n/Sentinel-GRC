export type Framework = {
  id: number;
  name: string;
  version: string;
  description?: string | null;
};

export type FrameworkDomain = {
  id: number;
  framework_id: number;
  name: string;
  description?: string | null;
};

export type SubControl = {
  id: number;
  control_id: number;
  description: string;
};

export type Control = {
  id: number;
  domain_id: number;
  control_code: string;
  title: string;
  description?: string | null;
};

export type ControlWithSubControls = Control & { sub_controls: SubControl[] };
export type DomainWithControls = FrameworkDomain & { controls: ControlWithSubControls[] };
export type FrameworkTree = Framework & { domains: DomainWithControls[] };

export type Risk = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  owner_id?: number | null;
  likelihood?: number | null;
  impact?: number | null;
  score?: number | null;
  status?: string | null;
};

