import { User } from "./user";
import { GitProject } from "./git-project";

export interface Transaction {
    id?: number,
    nb_tokens: number,
    nb_sdg: number,
    git_project: GitProject,
    transaction: Transaction,
    from_user: User,
    to_user: User
};
