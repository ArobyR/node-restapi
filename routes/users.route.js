import { Router } from "express";
import { check } from "express-validator";

import {
  isValidRole,
  isUniqueEmail,
  isExistsUserById,
  jwtValidator,
  fieldsValidator,
  isAdminRole,
  hasRole,
} from "../middlewares/";

import {
  create,
  retrieve,
  sofDelete,
  update,
} from "../controllers/users.controller";

const router = Router();

router.get("/", retrieve);

router.post(
  "/",
  [
    check("email", "this email is invalid").isEmail(),
    check("email").custom(isUniqueEmail),
    check(
      "password",
      "the password is required, and the minimun lenght is 6"
    ).isLength({ min: 6 }),
    check("name", "the name is required").not().isEmpty(),
    check("role", "the is a invalid role").custom(isValidRole),
    fieldsValidator,
  ],
  create
);

router.put(
  "/:id",
  [
    check("id", "This is an invalid Id").isMongoId(),
    check("id").custom(isExistsUserById),
    fieldsValidator,
  ],
  update
);

router.delete(
  "/:id",
  [
    jwtValidator,
    isAdminRole,
    hasRole("ADMIN", "USER"),
    check("id", "This is an invalid Id").isMongoId(),
    check("id").custom(isExistsUserById),
    fieldsValidator,
  ],
  sofDelete
);

export default router;
