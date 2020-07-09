import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useAddressContext } from 'vtex.address-context/AddressContext'
import { ButtonPlain, Spinner, Tooltip, IconLocation } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import { Address } from 'vtex.places-graphql'

import REVERSE_GEOCODE_QUERY from './graphql/reverseGeocode.graphql'

enum PermissionState {
  PROMPT,
  PENDING,
  GRANTED,
  DENIED,
}

interface Props {
  onSuccess?: (address: Address) => void
}

const DeviceCoordinates: React.FC<Props> = ({ onSuccess }) => {
  const { setAddress } = useAddressContext()
  const [geolocationPermission, setGeolocationPermission] = useState<
    PermissionState
  >(PermissionState.PROMPT)

  const [executeReverseGeocode, geoResult] = useLazyQuery(REVERSE_GEOCODE_QUERY)

  const { loading } = geoResult

  useEffect(() => {
    if (geoResult.data) {
      setAddress(geoResult.data.reverseGeocode)
      onSuccess?.(geoResult.data.reverseGeocode)
    }

    if (geoResult.error) {
      console.warn(geoResult.error.message)
    }
  }, [geoResult, setAddress, onSuccess])

  const onGetCurrentPositionSuccess = useCallback(
    ({ coords }: Position) => {
      setGeolocationPermission(PermissionState.GRANTED)

      executeReverseGeocode({
        variables: {
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
        },
      })
    },
    [executeReverseGeocode]
  )

  const onGetCurrentPositionError = useCallback((err: PositionError) => {
    setGeolocationPermission(PermissionState.DENIED)
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }, [])

  const requestGeolocation = useCallback(() => {
    setGeolocationPermission(PermissionState.PENDING)
    navigator.geolocation.getCurrentPosition(
      onGetCurrentPositionSuccess,
      onGetCurrentPositionError,
      {
        enableHighAccuracy: true,
      }
    )
  }, [onGetCurrentPositionError, onGetCurrentPositionSuccess])

  const handleButtonClick = () => {
    requestGeolocation()
  }

  useEffect(() => {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((result: PermissionStatus) => {
        if (result.state === 'denied') {
          setGeolocationPermission(PermissionState.DENIED)
        }
      })
  }, [requestGeolocation])

  const locationIcon = useMemo(() => {
    switch (geolocationPermission) {
      case PermissionState.PROMPT:
        return <IconLocation block />

      case PermissionState.GRANTED:
        return <IconLocation solid block />

      case PermissionState.PENDING:
        return <Spinner size={16} block />

      case PermissionState.DENIED:
        return <IconLocation block />

      default:
        return null
    }
  }, [geolocationPermission])

  let buttonElement = (
    <ButtonPlain
      disabled={geolocationPermission === PermissionState.DENIED}
      onClick={handleButtonClick}
    >
      <div className="flex items-center">
        <div className="flex-none mr3">
          {loading ? <Spinner size={16} /> : locationIcon}
        </div>
        <div className="flex-auto">
          <FormattedMessage id="place-components.label.useCurrentLocation" />
        </div>
      </div>
    </ButtonPlain>
  )

  if (geolocationPermission === PermissionState.DENIED) {
    buttonElement = (
      <Tooltip label="Permission not granted">{buttonElement}</Tooltip>
    )
  }

  return buttonElement
}

export default DeviceCoordinates