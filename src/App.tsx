import { useRef, useState } from "react"

function App() {
  return (
    <div className="bg-black flex items-center justify-center h-screen text-white">
      <Form />
    </div>
  )
}

export default App

const Form = () => {
  const [validated, setValidated] = useState<number | string | null>(null)
  const [imei, setImei] = useState<number | string | null>(null)
  const [message, setMessage] = useState<string>("Please enter an IMEI")
  const [error, setError] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = inputRef.current?.value

    // check if value is empty
    if (!value) {
      setError(true)
      return setMessage("Please enter an IMEI")
    }

    // check if value is a 14 digit or 15 digit number
    if (value.length !== 14 && value.length !== 15) {
      setError(true)
      return setMessage("IMEI must be 14 or 15 digits")
    }

    // if value is a 14 digit number, using the Luhn algorithm to calculate the check digit, calculate the check digit and add it to the end of the IMEI
    if (value.length === 14) {
      const checkDigit = calculateCheckDigit(value)
      setImei(Number(value + checkDigit))
      setError(false)
      setValidated(null)
      setMessage("Valid IMEI")
      return
    }

    // if value is a 15 digit number, check if the check digit is correct
    if (value.length === 15) {
      const checkDigit = calculateCheckDigit(value.slice(0, 14))
      if (checkDigit !== Number(value[14])) {
        setValidated(value.slice(0, 14) + checkDigit)
        setImei(value)
        setError(true)
        return setMessage("IMEI is not valid")
      }
      setImei(value)
      setValidated(null)
      setError(false)
      setMessage("Valid IMEI")
    }

    // calculate the checkDigit
    function calculateCheckDigit(imei: string) {
      const imeiArray = imei.split("").map(Number)
      const sum = imeiArray
        .map((digit, index) => {
          if (index % 2 === 0) {
            return digit
          } else {
            const doubled = digit * 2
            return doubled > 9 ? doubled - 9 : doubled
          }
        })
        .reduce((a, b) => a + b, 0)
      const checkDigit = (10 - (sum % 10)) % 10
      return checkDigit
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-4/5 md:w-1/3"
    >
      <p
        className={`text-center text-xl font-bold ${
          error ? "text-red-500" : "text-green-500"
        }`}
      >
        {message}
      </p>

      <div
        className={`text-center ${error ? "text-red-500" : "text-green-500"}`}
      >
        {imei}
      </div>

      {validated && (
        <p className="text-green-500 text-center font-bold">
          Validated IMEI: {validated}
        </p>
      )}
      <input
        type="number"
        ref={inputRef}
        className="p-2 text-black text-center rounded-sm"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 px-3 mx-2 rounded-md"
      >
        Submit
      </button>
    </form>
  )
}
