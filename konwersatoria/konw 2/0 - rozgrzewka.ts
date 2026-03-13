// Zatypuj Contact - musi zawierać email lub phone lub obydwa.

// 1. bad - why?
type Contact = {
  email?: string,
  phone?: string

































}
// 2. ok
type ContactEmail = {
  email: string,
}
type ContactPhone = {
  phone: string
}
type ContactPhoneEmail = ContactEmail & ContactPhone

// 3. też ok
type BetterContact =
  {
    phone?: string
    email?: string
  }
  & ({
    email: string,
  } | {
    phone: string
  })  