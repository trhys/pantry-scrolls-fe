import { useNavigate, useParams } from 'react-router'
import { useGetVerification } from '../api/verification.js'


export function VerificationPage() {
  const params = useParams()
  const { error, isLoading } = useGetVerification(params.token)
  const navigate = useNavigate()

  if (error) throw(error)

  if (!isLoading && !error) {
    navigate("/login")
  }

  if (isLoading) return (
    <p>Loading...</p>
  )
}
